var CONTACTS = [
  {
    id: 1,
    name: 'William',
    address: '1 CanJS Way',
    email: 'william@husker.com',
    phone: '0123456789',
    category: 'co-workers'
  },
  {
    id: 2,
    name: 'Laura',
    address: '1 CanJS Way',
    email: 'laura@starbuck.com',
    phone: '0123456789',
    category: 'friends'
  },
  {
    id: 3,
    name: 'Lee',
    address: '1 CanJS Way',
    email: 'lee@apollo.com',
    phone: '0123456789',
    category: 'family'
  }
];

var CATEGORIES = [
  {
    id: 1,
    name: 'Family',
    data: 'family'
  },
  {
    id: 2,
    name: 'Friends',
    data: 'friends'
  },
  {
    id: 3,
    name: 'Co-workers',
    data: 'co-workers'
  }
];

Contact = can.Model({
  findAll: 'GET /contacts',
  create  : "POST /contacts",
  update  : "PUT /contacts/{id}",
  destroy : "DELETE /contacts/{id}"
},{});

Category = can.Model({
  findAll: 'GET /categories'
},{});

Contact.List = can.Model.List({
  filter: function(category){
    this.attr('length');
    var contacts = new Contact.List([]);
    this.each(function(contact, i){
      if(category === 'all' || category === contact.attr('category')) {
        contacts.push(contact);
      }
    });
    return contacts;
  },

  count: function(category) {
    return this.filter(category).length;
  }
});

can.fixture('GET /contacts', function(){
  return [CONTACTS];
});

var id= 4;
can.fixture("POST /contacts", function(){
  return {id: (id++)};
});

can.fixture("PUT /contacts/{id}", function(){
  return {};
});

can.fixture("DELETE /contacts/{id}", function(){
  return {};
});

can.fixture('GET /categories', function(){
  return [CATEGORIES];
});

Contacts = can.Control({
  init: function(){
    this.element.html(can.view('views/contactsList.ejs', {
      contacts: this.options.contacts,
      categories: this.options.categories
    }));
  }
});

/**
 * Kategorien anzeigen
 */

Filter = can.Control({
  init: function(){
    var category = can.route.attr('category') || "all";
    this.element.html(can.view('views/filterView', {
      contacts: this.options.contacts,
      categories: this.options.categories
    }));
    this.element.find('[data-category="' + category + '"]').parent().addClass('active');
  },
  '[data-category] click': function(el, ev) {
    this.element.find('[data-category]').parent().removeClass('active');
    el.parent().addClass('active');
    can.route.attr('category', el.data('category'));
  }
});

/**
 *  Verwaltet URL um AJAX-Änderungen anzuzeigen
 */
can.route( 'filter/:category' );
can.route('', {category: 'all' });

$(document).ready(function(){
  $.when(Category.findAll(), Contact.findAll()).then(function(categoryResponse, contactResponse){
    var categories = categoryResponse[0],
      contacts = contactResponse[0];

    new Contacts('#contacts', {
      contacts: contacts,
      categories: categories
    });
    new Filter('#filter', {
      contacts: contacts,
      categories: categories
    });
  });
})
