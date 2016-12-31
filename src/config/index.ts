export interface IConfig {
    port: number;
}

export class ProductionConfig implements IConfig {
    public port: number = process.env.PORT || 9001;
}
