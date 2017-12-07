import {Component, OnInit} from '@angular/core';
import {Contact} from '../models/contact';
import {ContactsService} from '../contacts.service';
import {Router} from '@angular/router';
import {checkEmailAvailability} from '../email-availability-validator.directive';
import {validateEmail} from '../email-validator.directive';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GENDER} from '../data/gender';
import {COUNTRIES_DATA} from '../data/countries-data';

@Component({
  selector: 'trm-contacts-creator',
  templateUrl: './contacts-creator.component.html',
  styleUrls: ['./contacts-creator.component.css']
})
export class ContactsCreatorComponent implements OnInit {
  contactForm: FormGroup;
  gender = GENDER;
  countries = COUNTRIES_DATA;

  constructor(private contactsService: ContactsService, private router: Router, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.contactForm = this.fb.group({
      'name': ['', [Validators.required, Validators.minLength(3)]],
      'email': ['', validateEmail, checkEmailAvailability(this.contactsService)],
      'phone': this.fb.array(['']),
      'gender': '',
      'birthday': '',
      'website': '',
      'address': [{}]
    });
    this.contactForm.valueChanges.subscribe(console.log);
  }

  save(contact: Contact) {
    this.contactsService.addContact(contact)
      .subscribe(value => this.router.navigate(['/']));
  }

  addPhoneField() {
    const control = <FormArray>this.contactForm.get('phone');
    control.push(new FormControl(''));
  }

  removePhoneField(index) {
    const control = <FormArray>this.contactForm.get('phone');
    control.removeAt(index);
  }
}
