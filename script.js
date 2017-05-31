window.onload = function loadPage() {
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var birthdayInput = document.getElementById('birthDate');

    function Contact(name, email, phones, birthDate) {
        this.name = name;
        this.email = email;
        this.phones = phones;
        this.birthDate = birthDate;
    }

    function newContact(name, email, phones, birthDate) {
        var contact = new Contact(name, email, phones, birthDate);
        var num = book.push(contact) - 1;
        document.querySelector('.list').appendChild(contact.createContact(num));
        console.log(num);
        inputClear();
    }

    function phonesToHtml(phones) {
        var result = '';
        if (phones) {
            phones.forEach(function (obj) {
                result = result + '<div class="phone-number">' + obj + '</div>';
            });
        }
        return result;
    }

    Contact.prototype.createContact = function (num) {
        var contactCard = document.createElement('li');
        contactCard.setAttribute('data-id', num);
        contactCard.innerHTML =
            '<div class="name">' + this.name + '</div>' + phonesToHtml(this.phones) + '<div class="email">' + this.email + '</div><div class="birth-date">' +
            this.birthDate + '</div><button class="edit">Edit</button><button class="remove">Remove</button>';
        return contactCard;
    }

    //localStorage

    function Book() {}
    Book.prototype = [];
    Book.prototype.save = function () {
        localStorage.myApp = JSON.stringify(this);
    }
    var book = new Book();

    if (localStorage.myApp) {
        var lastContacts = JSON.parse(localStorage.myApp);
        delete lastContacts.length;
        for (var i in lastContacts) {
            newContact(lastContacts[i].name, lastContacts[i].email, lastContacts[i].phones, lastContacts[i].birthDate);
        }
    }
    // end of localStorage

    var add = document.getElementById('add');

    add.addEventListener('click', function (createContact) {
        var name = nameInput.value;
        var phones = [];
        document.querySelectorAll('.phone').forEach(function (element) {
            phones.push(element.value);
        });
        var email = emailInput.value;
        var birthDate = birthdayInput.value;
        newContact(name, email, phones, birthDate);
        book.save();
    });

    var addNubmer = document.querySelector('.add-number');
    addNubmer.addEventListener('click', function () {
        var number = document.createElement('input');
        number.classList.add('phone');
        document.querySelector('.hidden').style.display = 'block';
        document.querySelector('.hidden').appendChild(number);
    });

    var contactbook = document.querySelector('.list');
    contactbook.addEventListener('click', function (event, num) {
        if (event.target.classList.contains('edit')) {
            var id = event.target.parentNode.getAttribute("data-id");
            book.edit(id);
        };
        if (event.target.classList.contains('remove')) {
            event.target.parentNode.remove();
            var id = event.target.parentNode.getAttribute("data-id");
            book.forEach(function (contact, num) {
                if (num.toString() === id) {
                    delete book[num];
                }
            });
            book.save();
        }
    });

    Book.prototype.edit = function (id) {
        book.forEach(function (contact, num) {
            if (num.toString() === id) {
                nameInput.value = book[num].name;
                book[num].phones.forEach(function (phone, index, phones) {
                    document.querySelector('.hidden').style.display = 'block';
                    var numbers = document.querySelector('.hidden');
                    numbers.innerHTML = phonesToEdit(phones);
                });
                emailInput.value = book[num].email;
                birthdayInput.value = book[num].birthDate;
                document.getElementById('phoneNumber').style.display = 'none';
                document.getElementById('save').style.display = 'block';
                var buttonSave = document.getElementById('save');
                buttonSave.setAttribute('data-item', id);
                document.getElementById('add').style.display = 'none';
            }
        });
    }

    function phonesToEdit(phones) {
        var result = '';
        if (phones) {
            phones.forEach(function (obj) {
                result = result + '<input class="phone" value=" ' + obj + ' ">';
            });
        }
        return result;
    }

    var reSave = document.getElementById('save');
    reSave.addEventListener('click', function (event) {
        var id = reSave.getAttribute("data-item");
        book.reSave(id);
        console.log(id);
    });

    Book.prototype.reSave = function (id) {
        book.forEach(function (contact, num) {
            if (num.toString() === id) {
                book[num].name = nameInput.value;
                book[num].phones = [];
                document.querySelectorAll('.phone').forEach(function (element) {
                    if (element.value !== '') {
                        book[num].phones.push(element.value);
                    }
                });
                book[num].email = emailInput.value;
                book[num].birthDate = birthdayInput.value;
                document.getElementById('save').style.display = 'none';
                document.getElementById('add').style.display = 'block';
                document.querySelector('.hidden').style.display = 'none';
                document.getElementById('phoneNumber').style.display = 'block';
                var contact = book[num];
                ReSaveToHTML(id, contact);
            }
        });
        book.save();
    }

    function ReSaveToHTML(id, contact) {
        var li = document.querySelectorAll('[data-id="' + id + '"]')[0];
        var nextSibling = li.nextSibling;
        if (!nextSibling) {
            document.querySelector('.list').appendChild(contact.reSaveContact(id));
        } else {
            li.parentNode.insertBefore(contact.reSaveContact(id), nextSibling);
        }
        inputClear();
        li.remove();
    }

    Contact.prototype.reSaveContact = function (id) {
        var contactCard = document.createElement('li');
        contactCard.setAttribute('data-id', id);
        contactCard.innerHTML =
            '<div class="name">' + this.name + '</div>' + phonesToHtml(this.phones) + '<div class="email">' + this.email + '</div><div class="birth-date">' +
            this.birthDate + '</div><button class="edit">Edit</button><button class="remove">Remove</button>';
        return contactCard;
    }

    function inputClear() {
        nameInput.value = '';
        document.querySelectorAll('.phone').value = '';
        document.querySelectorAll('.phone').forEach(function (element) {
            element.value = '';
        });
        emailInput.value = '';
        birthdayInput.value = '';
    }

    Book.prototype.happyBirthday = function () {
        var now = new Date;
        var today = now.getMonth() + '-' + now.getDate();
        book.forEach(function (contact, num, book) {
            var birthday = book[num].birthDate;
            var converted = Date.parse(birthday);
            var myBirthday = new Date(converted);
            var birth = myBirthday.getMonth() + '-' + myBirthday.getDate();
            if (birth === today) {
                alert(this.book[num].name + ' сегодня празднует свой День Рождения!');
            }
        });
    }
    book.happyBirthday();

    //validation

    var enterName = nameInput;

    enterName.addEventListener('change', function () {
        var errorEl = this.parentNode.querySelector('.errorName');
        var dirty = this.dataset.dirty === 'true';
        if (!validName() && !dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
        this.dataset.dirty = 'true';
    });

    enterName.addEventListener('keyup', function () {
        var dirty = this.dataset.dirty === 'true';
        var errorEl = this.parentNode.querySelector('.errorName');
        if (!validName() && dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
    });

    function validName() {
        var val = nameInput.value;
        return isNaN(val) && val.length <= 20;
    }

    var enterNumber = document.querySelector('.phone');

    enterNumber.addEventListener('change', function () {
        var errorEl = this.parentNode.querySelector('.errorPhone');
        var dirty = this.dataset.dirty === 'true';
        if (!validNumber() && !dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
        this.dataset.dirty = 'true';
    });

    enterNumber.addEventListener('keyup', function () {
        var dirty = this.dataset.dirty === 'true';
        var errorEl = this.parentNode.querySelector('.errorPhone');
        if (!validNumber() && dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
    });

    function validNumber() {
        var val = document.querySelector('.phone').value;
        var num = parseFloat(val);
        return !isNaN(num) && num > 0 && !(num % 1) && val.length === 10;
    }

    var enterEmail = emailInput;

    enterEmail.addEventListener('change', function () {
        var errorEl = this.parentNode.querySelector('.errorEmail');
        var dirty = this.dataset.dirty === 'true';
        if (!validEmail() && !dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
        this.dataset.dirty = 'true';
    });

    enterEmail.addEventListener('keyup', function () {
        var dirty = this.dataset.dirty === 'true';
        var errorEl = this.parentNode.querySelector('.errorEmail');
        if (!validEmail() && dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
    });

    function validEmail() {
        var val = emailInput.value;
        var adr_pattern = /[0-9a-z_-]+@[0-9a-z_-]+\.[a-z]{2,5}/i;
        return adr_pattern.test(val) === true;
    }


    //не работает валидация даты рождения

    var enterBirthday = birthdayInput;

    enterBirthday.addEventListener('change', function () {
        console.log('change');
        var errorEl = this.parentNode.querySelector('.errorBirthday');
        var dirty = this.dataset.dirty === 'true';
        if (!validBirthday() && !dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
        this.dataset.dirty = 'true';
    });

    enterBirthday.addEventListener('keyup', function () {
        console.log('keyup');
        var dirty = this.dataset.dirty === 'true';
        var errorEl = this.parentNode.querySelector('.errorBirthday');
        if (!validBirthday() && dirty) {
            errorEl.style.display = 'inline';
        } else {
            errorEl.style.display = 'none';
        }
    });

    function validBirthday() {
        //        var val = birthdayInput.value;
        //        var converted = Date.parse(val);
        //        var birthday = new Date(converted);
        //        var birth = birthday.getYear();
        //        var birthYear = birth.toString();
        //        return birthYear > 1920;           

        var val = birthdayInput.value;
        var date_pattern = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/i;
        return !date_pattern.test(val) === true;
    }
}