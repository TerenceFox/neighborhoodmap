
var Restaurant = function (name, location, phone, id, menu, visited, favorite, visible, details, noteToggle, notes) {
  this.name = name;
  this.location = location;
  this.phone = phone;
  this.id = id;
  this.menu = menu;
  this.visited = ko.observable(visited);
  this.favorited = ko.observable(favorite);
  this.visible = ko.observable(visible);
  this.details = ko.observable(details);
  this.noteToggle = ko.observable(noteToggle);
  this.notes = ko.observable(notes);
};
