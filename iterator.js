'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friends = {};
    var depth = depth || Infinity;
    if (depth > Object.keys(collection).length) {
        depth = Object.keys(collection).length;
    }
    if (startPoint in collection) {
        var nextLevelQueue = [];
        var currentLevelQueue = [];
        var levelCounter = 1;
        var friendsToAdd = checkAndSortPersons(friends, startPoint,
        collection[startPoint]['friends']);
        nextLevelQueue = nextLevelQueue.concat(friendsToAdd);
        while (levelCounter <= depth && nextLevelQueue.length > 0) {
            levelCounter++;
            currentLevelQueue = nextLevelQueue;
            nextLevelQueue = [];
            while (currentLevelQueue.length > 0) {
                var currentPoint = currentLevelQueue.shift();
                if (!(currentPoint in friends) && currentPoint !== startPoint) {
                    friends[currentPoint] = collection[currentPoint];
                }
                friendsToAdd = checkAndSortPersons(friends, startPoint,
                collection[currentPoint]['friends']);
                nextLevelQueue = nextLevelQueue.concat(friendsToAdd);
            }
        }
    }
    var stringifyResult = function (position) {
        var result = {};
        var personName = orderedFriendsNames[position];
        result.name = personName;
        result.phone = friends[personName]['phone'];
        return (JSON.stringify(result));
    };

    var maleIterator = function (direction) {
        var stringifiedPerson = direction();
        while (stringifiedPerson !== null) {
            var currentPerson = JSON.parse(stringifiedPerson);
            if (friends[currentPerson.name]['gender'] === 'Мужской') {
                return stringifiedPerson;
            }
            stringifiedPerson = direction();
        }
        return null;
    };

    var orderedFriendsNames = [];
    for (var friendName in friends) {
        orderedFriendsNames.push(friendName);
    }
    var positionToShow = -1;

    return {
        next: function (name) {
            if (positionToShow + 1 >= orderedFriendsNames.length ||
            Object.keys(friends).length == 0) {
                return null;
            }
            if (name in friends) {
                positionToShow = orderedFriendsNames.indexOf(name);
            } else if (name !== undefined) {
                return null;
            } else {
                positionToShow++;
            }
            return (stringifyResult(positionToShow));
        },
        prev: function () {
            if (positionToShow - 1 < 0 || Object.keys(friends).length == 0) {
                return null;
            }
            positionToShow--;
            return (stringifyResult(positionToShow));
        },
        nextMale: function () {
            return maleIterator(this.next);
        },
        prevMale: function () {
            return maleIterator(this.prev);
        }
    };
};

function checkAndSortPersons(friends, startPoint, candidatesToAdd) {
    var resultPersons = [];
    candidatesToAdd = candidatesToAdd.sort();
    for (var i = 0; i < candidatesToAdd.length; i++) {
        if (!(candidatesToAdd[i] in friends) && candidatesToAdd[i] !== startPoint) {
            resultPersons.push(candidatesToAdd[i]);
        }
    }
    return resultPersons;
};

