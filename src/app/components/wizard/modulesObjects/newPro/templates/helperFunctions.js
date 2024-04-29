export function convertEnglishToArabic(english, notreverse) {
  // 
  var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  if (english == null || english == "") {
    return "";
  } else {
    var chars = english.split("");
    for (var i = 0; i < chars.length; i++) {
      if (/\d/.test(chars[i])) {
        chars[i] = arabicNumbers[chars[i]];
      }
    }
    let revesedChars = chars.join("");
    if (notreverse) return revesedChars; //.split('/').reverse().join('/')
    return revesedChars.split("/").reverse().join("/");
  }
}
export function convertEnglishNotReverseToArabic(english) {
    
    var arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    if(english==null||english==""){
      return ''
    }else{

    var chars = english.split('');
    for (var i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
            chars[i] = arabicNumbers[chars[i]];
        }
    }
    let revesedChars = chars.join('');
    return revesedChars
  }
}