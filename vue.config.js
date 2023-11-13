// module.exports = {
//     pluginOptions: {
//         electronBuilder: {
//             nodeIntegration: true
//         }
//     }
// }

module.exports = {
    transpileDependencies: ["vuetify"],
    pluginOptions: {
      electronBuilder: {
        nodeIntegration: true,
        builderOptions: {
  //Add also your database location
          extraResources: ['src/res/'] 
        },
   //This line: add knex and sqlite3
        externals: ['knex','sqlite3'],
      }
    }
  };