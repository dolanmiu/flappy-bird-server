export interface IConfig {
    port: number;
}

export class ProductionConfig implements IConfig {
    public port = 9001;
}
