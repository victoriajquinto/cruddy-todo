const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
Promise.promisifyAll(fs);

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
  // fs.readdir(exports.dataDir, (err, files) => {
  //   let results = files.map((file) => { return {id: file.slice(0, 5), text: file.slice(0, 5)}; });
  //   callback(null, results);
  // });

  //get a list of all the file names, map over each file name, maybe create an object with two properties: id and 'text' (which is set to the id rather than the actual contents of the file)

  //promisify fs, which will make async versions of fs methods available
  //start with readdirAsync. get array returned from readdirAsync
  return fs.readdirAsync(exports.dataDir).then((files)=> {
    return files.map((fileName) => {
      let id = fileName.slice(0, 5);
      return fs.readFileAsync(`${exports.dataDir}/${id}.txt`, 'utf8').then((content) => {
        let object = { id: id, text: content };
        return object;
      });
    });
  }).then((array) => {
    return Promise.all(array).then((results) => { console.log('results', results); callback(null, results); });
  });

  //call Promise.all([array]).then(()=>{[push object to results array]})
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    // let text = JSON.stringify(data);

    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {

    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, data) => {
        callback(null, { id: id, text: data });
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  fs.rm(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null);
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
