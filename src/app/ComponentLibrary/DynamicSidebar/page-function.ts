export interface PageFunction{
    name:string;
    desc:string;
    scope?:string,
    url:string;
    breadcrumb_path?:any[];
    breadcrumb_label:string;
    permissions:string[];
    icon?:string;
}