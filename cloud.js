'use strict';
var AV = require('leanengine');

// var TestObject = AV.Object.extend('AVCloudTest');


var MemberLog = AV.Object.extend('MemberLog');
var MonthLog = AV.Object.extend('GroupMonthLog');
var WeekLog = AV.Object.extend('GroupWeekLog');



// 处理个人数据
var handlePersonData = function(data) {
    return {
        name: data.attributes.name,
        groupId: data.attributes.groupId,
        updateAt: data.updatedAt,
        workList: data.attributes.workList || [],
        leaveList: data.attributes.leaveList || []
    };
};
// 处理小组月计划数据
var handleMonthPlan = function(data,type) {
    return{
        groupName: data.attributes.groupName,
        monthPlanList:data.attributes.monthPlanList,
        monthPlanUpdate:data.attributes.monthPlanUpdate
    };

};
// 处理小组周计划数据
var handleweekPlan = function(data,type) {
    return {
        groupName: data.attributes.groupName,
        weekplanList :data.attributes.planList,
        weekplanUpdate : data.attributes.planUpdate
    };
};
/**
 * [makeDataInArray 数据放入数组]
 * @param  {[type]} data  [数据]
 * @param  {[type]} hanle [处理函数]
 * @return {[type]}       [新数组]
 */
var makeDataInArray = function(data,hanle){
    var result = [];
    data.forEach(function(item,index){
        result.push(hanle(item));
    });
    return result;
};
// 成员日志备份
AV.Cloud.define('memberBackup', function (request, response) {
    var query = new AV.Query('WeekReport');
    query.exists('objectId');
    // 按小组、成员索引排序，保证顺序一致
    query.addAscending('groupId');
    query.addAscending('memberIndex');
    //
    query.find().then(function(result){
        // 处理查找到的数据
        var data = makeDataInArray(result,handlePersonData);
        // 保存
        var memberLog = new MemberLog();
        memberLog.set('content',data);
        memberLog.set('backupDate',new Date());
        memberLog.save().then(function(){
            console.log('memberLog backup success!');
            response.success('memberLog backup success!');
        });
    });
});

// 小组周计划备份
AV.Cloud.define('weekBackup', function (request, response) {
    var query = new AV.Query('GroupReport');
    query.exists('objectId');
    // 按小组、成员索引排序，保证顺序一致
    query.addAscending('groupId');

    query.find().then(function(result){
        // 处理查找到的数据
        var data = makeDataInArray(result,handleweekPlan);
        // 保存
        var weekLog = new WeekLog();
        weekLog.set('content',data);
        weekLog.set('backupDate',new Date());
        weekLog.save().then(function(){
            console.log('weekPlan backup success!');
            response.success('weekPlan backup success!');
        });
    });
});
// 小组月计划备份
AV.Cloud.define('monthBackup', function (request, response) {
    var query = new AV.Query('GroupReport');
    query.exists('objectId');
    // 按小组、成员索引排序，保证顺序一致
    query.addAscending('groupId');

    query.find().then(function(result){
        // 处理查找到的数据
        var data = makeDataInArray(result,handleweekPlan);
        // 保存
        var monthLog = new MonthLog();
        monthLog.set('content',data);
        monthLog.set('backupDate',new Date());
        monthLog.save().then(function(){
            console.log('monthPlan backup success!');
            response.success('monthPlan backup success!');
        });
    });
});






// var errorFn = function (res) {
//     return function (error) {
//         res.error(error);
//     }
// };
// AV.Cloud.define('hello', function (request, response) {
//     response.success('Hello world!');
// });
//
// AV.Cloud.define('echoError', function (request, response) {
//     response.error(request.params);
// });
//
// AV.Cloud.define('echoSuccess', function (request, response) {
//     response.success(request.params);
// });
//
// AV.Cloud.define('errorCode', function (req, res) {
//     AV.User.logIn('NoThisUser', 'lalala', {
//         error: function (user, err) {
//             res.error(err);
//         }
//     });
// });
//
// AV.Cloud.define('basicErrorCode', function (req, res) {
//     res.error('basic error message');
// });
//
// AV.Cloud.define('customErrorCode', function (req, res) {
//     res.error({code: 123, message: 'custom error message'});
// });
//
// AV.Cloud.define('fetchObject', function (req, res) {
//     var data = req.params.obj;
//     // 更简洁的方法? create object from:
//     //  {"__type":"Pointer","className":"Armor","objectId":"55d057a760b2b750996800fd"}
//     var obj = AV.Object.createWithoutData(data.className, data.objectId);
//     obj.fetch().then(function (obj) {
//         res.success(obj);
//     }, errorFn(res));
// });
//
// AV.Cloud.define('fullObject', function (req, res) {
//     var obj = new TestObject();
//     obj.set('boolean', true);
//     obj.set('number', 1);
//     obj.set('string', 'string');
//     obj.set('date', new Date());
//     obj.set('array', ["a", "b"]);
//     obj.set('map', {"a": 1, "b": 2});
//     obj.save().then(function () {
//         res.success(obj._toFullJSON());
//     }, errorFn(res));
// });
//
// AV.Cloud.define('complexObject', function (req, res) {
//     var testObj = req.params.testObject;
//     var obj = new TestObject();
//     obj.set('boolean', true);
//     obj.set('number', 1);
//     obj.save().then(function () {
//         res.success({
//             foo: 'bar',
//             i: 123,
//             obj: {
//                 a: 'b',
//                 as: [1, 2, 3]
//             },
//             t: new Date('2015-05-14T09:21:18.273Z'),
//             avObject: obj,
//             avObjects: [obj, testObj],
//             testObject: testObj
//         });
//     }, errorFn(res));
// });
//
// AV.Cloud.beforeSave('AVCloudTest', function (req, res) {
//     var string = req.object.get('string');
//     if (string) {
//         if (string.length > 10) {
//             req.object.set('string', string.substring(0, 10));
//         }
//         res.success();
//     } else {
//         res.success();
//     }
// });

module.exports = AV.Cloud;
