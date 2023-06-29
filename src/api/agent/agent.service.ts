import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Booking, CreateUpdateBookingDto, LoginDto, Membership, Provider, Doctor } from './dtos';
import { Request } from 'express';
import * as qs from 'qs';
import { successResponse } from 'src/utils/response';
import { SuperAgent } from 'src/entities/super-agent.entity';
import { SuperAgentLoginDto } from './dtos/super-agent-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ServiceType } from 'src/entities/service-type.entity';
import { Agents } from 'src/entities/agents.entity';
import * as logger from '../../utils/logger';
import { HmgErrorException } from 'src/exceptions/hmg-exception';

@Injectable()
export class AgentService {
    constructor(
        private config: ConfigService,
        @InjectRepository(SuperAgent) private superAgentRepo: Repository<SuperAgent>,
        @InjectRepository(ServiceType) private serviceTypeReop: Repository<ServiceType>,
        @InjectRepository(Agents) private agentRepo: Repository<Agents>,
    ) {}

    async login(dto: LoginDto) {
        const OKTA_URL = this.config.get('okta.base_url') + '/introspect';
        // const clientId = this.config.get('okta.client_id');
        const HMG_LOGIN_ROOT = this.config.get('hmg.api_root') + '/agent/auth/login';
        const HMG_API_KEY = this.config.get('hmg.api_key');
        const HMG_GROUP_ID = this.config.get('hmg.group_id');
        const HMG_TEST_TOKEN = this.config.get('hmg.test_token');
        try {
            // We need a way to test the full login flow,
            // however, Sunlife was not actively giving us a real token,
            // so we set a test token, when using test token, bypass okta check and use hardcoded agent_001
            let oktaRes = null;
            if (dto.token !== HMG_TEST_TOKEN) {
                /* oktaRes = await axios
                    .post(
                        OKTA_URL,
                        { token: dto.token, token_type_hint: 'access_token' },
                        { params: { client_id: clientId } },
                    )
                    .then((res) => res.data); */
                // client_id is dynamic, parse it from the JWT cid
                const parsedToken = JSON.parse(Buffer.from(dto.token.split('.')[1], 'base64').toString());
                if (!parsedToken.cid) {
                    throw {
                        response: {
                            statusText: 'Forbidden',
                            status: HttpStatus.FORBIDDEN,
                        },
                    };
                }
                oktaRes = await axios
                    .post(OKTA_URL, qs.stringify({ token: dto.token, token_type_hint: 'access_token' }), {
                        params: { client_id: parsedToken.cid },
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    })
                    .then((res) => res.data);

                logger.event([
                    'OKTA Login',
                    {
                        url: OKTA_URL,
                        request: { client_id: parsedToken.cid },
                        response: oktaRes,
                    },
                ]);

                // If veriflied token does not return agent id, return error
                if (!oktaRes.sub)
                    throw {
                        response: {
                            statusText: 'Forbidden',
                            status: HttpStatus.FORBIDDEN,
                        },
                    };
            }
            const agentCode =
                dto.token === HMG_TEST_TOKEN
                    ? dto.agentCode
                        ? dto.agentCode.toLowerCase()
                        : 'agent_001'
                    : oktaRes.sub;
            const loginRes = await axios
                .post(HMG_LOGIN_ROOT, {
                    groupId: HMG_GROUP_ID,
                    agentCode: agentCode,
                    apiKey: HMG_API_KEY,
                })
                .then((res) => res.data);
            logger.event([
                'HMG Login',
                {
                    url: HMG_LOGIN_ROOT,
                    request: {
                        groupId: HMG_GROUP_ID,
                        agentCode: agentCode,
                        apiKey: HMG_API_KEY,
                    },
                    response: loginRes,
                },
            ]);

            loginRes.data.agentCode = agentCode; // Attach agent code to frontend
            await this.agentRepo.save({
                agentCode: agentCode.toLowerCase(),
                token: loginRes.data.accessToken,
                isSuper: loginRes.data.isAdmin === 'Y',
            });
            return {
                status: 200,
                data: { loginRes },
            };
        } catch (error) {
            if (error.response) {
                throw new HttpException(error.response.statusText, error.response.status);
            }
            throw new HmgErrorException('AUTHENTICATION_ERROR');
        }
    }

    async superAgentLogin(dto: SuperAgentLoginDto) {
        const HMG_LOGIN_ROOT = this.config.get('hmg.api_root') + '/agent/auth/login';
        const HMG_GROUP_ID = this.config.get('hmg.group_id');
        const HMG_API_KEY = this.config.get('hmg.api_key');
        try {
            const username = dto.username;
            const password = dto.password;
            const superAgent = await this.superAgentRepo.findOne({
                where: {
                    username,
                },
            });
            if (superAgent == null) {
                throw new HmgErrorException('AUTHENTICATION_USER_ERROR', HttpStatus.FORBIDDEN);
            }
            const check = await bcrypt.compare(password, superAgent.password);
            if (!check) {
                throw new HmgErrorException('AUTHENTICATION_USER_ERROR', HttpStatus.FORBIDDEN);
            }
            const agentCode = superAgent.agent_code;
            const loginRes = await axios
                .post(HMG_LOGIN_ROOT, {
                    groupId: HMG_GROUP_ID,
                    agentCode: agentCode,
                    apiKey: HMG_API_KEY,
                })
                .then((res) => res.data);
            await this.agentRepo.save({
                agentCode: agentCode.toLowerCase(),
                token: loginRes.data.accessToken,
                isSuper: loginRes.data.isAdmin === 'Y',
            });
            return {
                status: 200,
                data: { loginRes },
            };
        } catch (error) {
            throw new HmgErrorException('AUTHENTICATION_ERROR');
        }
    }

    async getMembership(query: Membership, req: Request) {
        const {
            policyOwnerNameEng,
            policyOwnerNameChi,
            nameEn,
            nameZh,
            productNameEn,
            productNameZh,
            policyNumber,
            agentId,
            planLevelCode,
            categoryCode,
            pageNum,
            //pageSize, // Fix to 10000 now from HMG
        } = query;
        const HMG_MEMBERSHIP_ROOT = this.config.get('hmg.api_root') + '/agent/membership';
        const token = req.headers['authorization'].split(' ')[1];
        try {
            const { data } = await axios.get(HMG_MEMBERSHIP_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    policyOwnerNameEng,
                    policyOwnerNameChi,
                    nameEn,
                    nameZh,
                    productNameEn,
                    productNameZh,
                    policyNumber,
                    agentId,
                    planLevelCode,
                    categoryCode,
                    pageNum,
                    pageSize: 10000,
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_MEMBERSHIP_ERROR');
        }
    }

    async getServiceAndSymptomsTypes(planLevelCode: string, req: Request) {
        const HMG_SERVICE_TYPE_ROOT = this.config.get('hmg.api_root') + '/agent/service-type';
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.get(HMG_SERVICE_TYPE_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    planLevelCode,
                    pageSize: 1000, // To prevent pagination
                    sortKey: 'description',
                    sortDir: 'ASC',
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_SERVICE_SYMPTOMS_ERROR');
        }
    }

    async getServiceAndSymptomsByType(medicalProcedureType: string, req: Request) {
        const HMG_SERVICE_SYMPTOMS_ROOT = this.config.get('hmg.api_root') + '/agent/service';
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.get(HMG_SERVICE_SYMPTOMS_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    medicalProcedureType,
                    pageSize: 1000, // To prevent pagination
                    sortKey: 'nameEn',
                    sortDir: 'ASC',
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_SERVICE_SYMPTOMS_BY_TYPE_ERROR');
        }
    }

    async getBookingRecords(query: Booking, req: Request) {
        const {
            memberId,
            status,
            symptomsType,
            policyNumber,
            insuredNameEng,
            insuredNameChi,
            productNameEng,
            referenceNo,
            pageNum,
            // pageSize, // Fixed to 10000 by HMG
        } = query;

        const HMG_BOOKING_RECORDS_ROOT = this.config.get('hmg.api_root') + '/agent/booking';
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.get(HMG_BOOKING_RECORDS_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    memberId,
                    status,
                    symptomsType,
                    policyNumber,
                    insuredNameEng,
                    insuredNameChi,
                    productNameEng,
                    referenceNo,
                    pageNum,
                    pageSize: 10000,
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_BOOKING_RECORDS_ERROR');
        }
    }

    async getRegionAndLocation(serviceCode: string, req: Request) {
        const HMG_LOCATION_ROOT = this.config.get('hmg.api_root') + '/agent/location';
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.get(HMG_LOCATION_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    serviceCode,
                    sortKey: 'nameEn',
                    sortDir: 'ASC',
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_REGION_LOCATION_ERROR');
        }
    }

    async getProviders(query: Provider, req: Request) {
        const { locationCode, serviceCode } = query;
        let { bookingPlanLevelCode } = query;

        const HMG_PROVIDERS_ROOT = this.config.get('hmg.api_root') + '/agent/provider';
        const token = req.headers['authorization'].split(' ')[1];

        try {
            if (serviceCode) {
                const result = await this.serviceTypeReop.findOne({
                    where: {
                        prefix: serviceCode.split('_')[0],
                    },
                });
                if (result && result.isUniversalService) {
                    bookingPlanLevelCode = 'UNIV';
                }
            }
            const { data } = await axios.get(HMG_PROVIDERS_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    locationCode,
                    serviceCode,
                    bookingPlanLevelCode,
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_PROVIDERS_ERROR');
        }
    }

    async getDoctors(query: Doctor, req: Request) {
        const { providerCode, procedureCode } = query;
        const HMG_DOCTORS_ROOT = this.config.get('hmg.api_root') + '/agent/doctor';
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.get(HMG_DOCTORS_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    providerCode,
                    procedureCode,
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_DOCTOR_ERROR');
        }
    }

    async createOrUpdateBooking(dto: CreateUpdateBookingDto, accessToken) {
        const HMG_BOOKING_ROOT = this.config.get('hmg.api_root') + '/agent/booking';
        const createRes = await axios
            .post(
                HMG_BOOKING_ROOT,
                { ...dto },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            )
            .then((res) => res.data)
            .catch((err) => {
                throw new HmgErrorException('CREATE_UPDATE_RECORD_ERROR');
            });

        return successResponse(createRes);
    }

    async getAvailableStatus(id: string, req: Request) {
        const path = `/agent/booking/${id}/available-status`;
        const HMG_GET_STATUS_ROOT = this.config.get('hmg.api_root') + path;
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.get(HMG_GET_STATUS_ROOT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('GET_STATUS_ERROR');
        }
    }

    async updateStatus(id: string, status: string, req: Request) {
        const path = `/agent/booking/${id}/change-status`;
        const HMG_UPDATE_STATUS_ROOT = this.config.get('hmg.api_root') + path;
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.put(
                HMG_UPDATE_STATUS_ROOT,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('UPDATE_STATUS_ERROR');
        }
    }

    async logOut(req: Request) {
        const path = `/agent/auth/logout`;
        const HMG_GET_LOG_OUT_ROOT = this.config.get('hmg.api_root') + path;
        const token = req.headers['authorization'].split(' ')[1];

        try {
            const { data } = await axios.post(
                HMG_GET_LOG_OUT_ROOT,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return {
                status: 200,
                data,
            };
        } catch (error) {
            throw new HmgErrorException('LOGOUT_ERROR');
        }
    }
}
