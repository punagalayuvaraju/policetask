import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
     /*
    @param
    list    array   
    args    string
    data    array
    @Output
    Filters the array with args
    */
   transform(list: any, args: string,data:any,unique:any): string {
    if(!args){
        return list;
    }
    return _.uniqBy(list.filter((lock) => {
        return data.some((element) => {
            return (lock[element].toLowerCase().match(args.toLowerCase()));
        });
      }), unique)
}
}
 