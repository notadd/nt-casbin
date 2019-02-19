import { Enforcer } from 'casbin';

// 授权中间件
export function authz(newEnforcer: () => Promise<Enforcer>) {
    return async (req, res, next) => {
        const enforcer = await newEnforcer();
        if (!(enforcer instanceof Enforcer)) {
            res.status(500).json({ 500: 'Invalid enforcer' });
            return;
        }
        req.user = { username: 'alice' };
        const authzorizer = new BasicAuthorizer(req, enforcer);
        if (!authzorizer.checkPermission()) {
            res.status(403).json({ 403: 'Forbidden' });
            return;
        }
        next();
    };
}

// casbin处理程序
export class BasicAuthorizer {
    private req: any;
    private enforcer: any;
    constructor(req, enforcer) {
        this.req = req;
        this.enforcer = enforcer;
    }

    getUserName() {
        const { user } = this.req;
        const { username } = user;
        return username;
    }

    // 检查权限
    checkPermission() {
        const { req, enforcer } = this;
        const { originalUrl: path, method } = req;
        const user = this.getUserName();
        return enforcer.enforce(user, path, method);
    }
}
