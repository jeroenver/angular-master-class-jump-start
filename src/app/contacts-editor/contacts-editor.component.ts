import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Contact } from '../models/contact';
import { ContactsService } from '../contacts.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {validateEmail} from '../email-validator.directive';
import {checkEmailAvailability} from '../email-availability-validator.directive';
import {COUNTRIES_DATA} from '../data/countries-data';
import {GENDER} from '../data/gender';

@Component({
  selector: 'trm-contacts-editor',
  templateUrl: './contacts-editor.component.html',
  styleUrls: ['./contacts-editor.component.css']
})
export class ContactsEditorComponent implements OnInit {
  contactForm: FormGroup;
  gender = GENDER;
  countries = COUNTRIES_DATA;

  // we need to initialize since we can't use ?. operator with ngModel
  contact: Contact = <Contact>{ address: {}};

  constructor(private contactsService: ContactsService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder) {}

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

    this.contactsService.getContact(this.route.snapshot.paramMap.get('id'))
                        .subscribe(contact => {
                          this.contact = contact;
                          this.contactForm.get('email').setAsyncValidators(checkEmailAvailability(this.contactsService, this.contact.email));
                          this.contactForm.patchValue(contact);
                        });
  }

  cancel(contact: Contact) {
    this.goToDetails(contact);
  }

  save(contact: Contact) {
   this.contactsService.updateContact(contact)
                       .subscribe(() => this.goToDetails(contact));
  }

  addPhoneField() {
    const control = <FormArray>this.contactForm.get('phone');
    control.push(new FormControl(''));
  }

  removePhoneField(index) {
    const control = <FormArray>this.contactForm.get('phone');
    control.removeAt(index);
  }

  private goToDetails(contact: Contact) {
    this.router.navigate(['/contact', contact.id ]);
  }
}

