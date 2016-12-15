function cleanProperties (obj) {
  return obj.map(function(item){
    return item.replace(/\n/, '');
  });
}

module.exports = cleanProperties;
