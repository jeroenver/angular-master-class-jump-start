import {Directive, forwardRef} from '@angular/core';
import {ContactsService} from './contacts.service';
import {AbstractControl, FormControl, NG_ASYNC_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {map} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

export function checkEmailAvailability(contactsService: ContactsService, allowedEmail?: string) {
  return (c: FormControl) => {
    if (allowedEmail && allowedEmail === c.value) {
      return of(null);
    }
    return contactsService.isEmailAvailable(c.value)
      .pipe(map((data: any) => {
        return data.msg ? null : {emailTaken: true};
      }));
  }
}

@Directive({
  selector: '[trmCheckEmailAvailability][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => EmailAvailabilityValidatorDirective),
      multi: true
    }
  ]
})
export class EmailAvailabilityValidatorDirective implements Validator {
  _validate: Function;

  constructor(private contactsService: ContactsService) {
    this._validate = checkEmailAvailability(contactsService);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this._validate(c);
  }

}
