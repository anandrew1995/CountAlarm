import RNDBModel from 'react-native-db-models';

let DB = {
    "AlarmList": new RNDBModel.create_db('AlarmList'),
    "ItemList": new RNDBModel.create_db('ItemList'),
}

module.exports = DB