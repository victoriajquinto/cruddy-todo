const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (() => { callback(null, { id, text }); }));
  });

  // fs.writeFile(`./data/${id}.txt`, text, callback(null, { id, text }

  // items[id] = text;
  // ;
  //idea: change null in line 13 to be path to a new file in data folder

  // fs.writeFile(`./data/${id}.txt`, text, )
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  // { id: id, text: text }
  fs.readdir(exports.dataDir, (err, files) => {
    console.log(files);
    let results = files.map((file) => { return {id: file.slice(0, 5), text: file.slice(0, 5)}; });
    callback(null, results);
  });

  //get a list of all the file names, map over each file name, maybe create an object with two properties: id and 'text' (which is set to the id rather than the actual contents of the file)
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
