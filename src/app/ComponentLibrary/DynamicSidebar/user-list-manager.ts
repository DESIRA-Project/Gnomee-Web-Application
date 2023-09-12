import { ActivatedItem } from "./activated-item";
import { UserFunctionContentComponent } from "./user-function-content.component";
import { UserFunctionListComponent } from "./user-function-list.component";

export interface UserListManager extends ActivatedItem{
    setFunctionList(u:UserFunctionListComponent):void;
    setFunctionContentComponent(c:UserFunctionContentComponent):void;
}