# tidegauge-visualisation

common.js is the project configuration file, where you can configure your own api path, edit the language pack, modify the big screen logo path, etc.

#Tide Station System Language Addition Process Instructions

1. Edit the src\config\common.js file
Add the Portuguese language pack key-value pair in the langs object. The key-value can be customized.
For example: langs: {
               "pt": "Portuguese"
             }

2. Add the Portuguese translation file in the src\lang folder, such as pt.js. The js file name can be customized.
Import the Vuetify Portuguese language pack at the head of the current js file, that is:
import pt from 'vuetify/es5/locale/pt;
export default {
  ..pt,
}
For the specific format, please refer to en.js and translate the remaining English in the quotation marks into Portuguese, such as:
login: {
  authorizationTitle: 'Valorizamos a sua privacidade',
  ......
},
......
You can also customize and add other field translations

3. Edit the src\plugins\vuetify.js file
(1) Import the newly added Portuguese translation file in the previous step: import pt from '../lang/pt',
note that the variable name after import must be consistent with the key in the langs object in the first step, here is pt
(2) Add judgment in the if-else-if block:
else if(navLang.startsWith('pt')){ //The variable name in the quotation marks in this step should be judged according to the specific browser
  navLang = 'pt' //The variable value here must be consistent with the key in the langs object in the first step, here is pt
},
The purpose of this is to ensure that the language setting can be based on the default language of the browser when accessing the tide station system for the first time
(3) Add the variable name introduced in (1) to the locales of the lang object, here is pt,
For example: lang: {
               locales: { pt }
             }
