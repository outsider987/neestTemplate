export const StringManipulation = {
    same: (str, char) => {
        let i = str.length;
        while (i--) {
            if (str[i] !== char) {
                return false;
            }
        }
        return true;
    },
    nextLetter: (l) => {
        if (l < 90) {
            return String.fromCharCode(l + 1);
        } else {
            return 'A';
        }
    },
    nextChar: (c) => {
        const u = c.toUpperCase();
        if (StringManipulation.same(u, 'Z')) {
            let txt = '';
            let i = u.length;
            while (i--) {
                txt += 'A';
            }
            return (txt + 'A');
        } else {
            let p = '';
            let q = '';
            if (u.length > 1) {
                p = u.substring(0, u.length - 1);
                q = String.fromCharCode(p.slice(-1).charCodeAt(0));
            }
            const l = u.slice(-1).charCodeAt(0);
            const z = StringManipulation.nextLetter(l);
            if (z === 'A') {
                return p.slice(0, -1) + StringManipulation.nextLetter(q.slice(-1).charCodeAt(0)) + z;
            } else {
                return p + z;
            }
        }
    },
};
