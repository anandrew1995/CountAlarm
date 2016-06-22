import Store from 'react-native-store';

const DB = {
    'AlarmList': Store.model('AlarmList'),
    'ItemList': Store.model('ItemList')
};

module.exports = DB