import {map, includes} from 'lodash'

//function to format an array of strings to date and the array looks like ['dd','mm','yyy']
function formatDate(dateArray){
    const dateArrayInt = map(dateArray,  value=> parseInt(value))
    return new Date(dateArrayInt[2], dateArrayInt[1], dateArrayInt[0])
}


//a function to sort the reqest number as the req consists of two number seperated by /
//eg. 44/1440 so we need to sort based on the sec number first then the first one
export function sortReqNum (a, b){
    let newA = a.request_no.split('/').map(v => parseInt(v))
    let newB = b.request_no.split('/').map(v => parseInt(v))
    return newA[1] - newB[1] || newA[0] - newB[0] ;

}


export function sortDate (a,b, name){
    let splitter = a[name].includes('/') ? '/' : a[name].includes('-') ? '-' : ''
    const dateA = formatDate (a[name].split(splitter)) 
    const dateB = formatDate (b[name].split(splitter)) 
    return (dateA - dateB)
}

//a function to sort names in arabic format
export function sortName (a,b, name){
    const comparer = new Intl.Collator("ar")
    //the name param is the field name in the table, there are some fields that are not direct in the data
    //but are inside and object eg. Creator.name so had to split it then get that object in the data
    //by data.Creator.name => which is equivalent to => a[name[0]][name[1]] after splitting the name
    let newName = name.includes('.') ? name.split('.') : null
    let newA = newName ? a[newName[0]][newName[1]] : a[name]
    let newB = newName ? b[newName[0]][newName[1]] : b[name]
    return comparer.compare(newA,newB)
}

export function sortNum(a,b,name) {
    return a[name] - b[name]
}