import { Injectable } from '@angular/core';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore/lite';
import { from, Observable, throwError } from 'rxjs';

import { FirebasePublicClientService } from './firebase-public-client.service';

export type InquiryInterest = 'puppy' | 'adult' | 'either';

export interface InquirySubmissionInput {
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  interest: InquiryInterest;
  message: string;
  source?: 'available-page' | 'questionnaire-page';
  questionnaire?: {
    primaryName: string;
    sexPreference: string;
    colorPreference: string;
    previousSheltieOwnership: string;
    homeSummary: string;
    returnToBreederAgreement: boolean;
    breedingContractAcknowledgement: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class InquirySubmissionService {
  private firestore = this.firebasePublicClientService.getFirestore();

  constructor(private firebasePublicClientService: FirebasePublicClientService) {}

  submitInquiry(input: InquirySubmissionInput): Observable<void> {
    if (!this.firestore) {
      return throwError(() => new Error('Firebase Firestore is not configured.'));
    }

    return from(
      addDoc(collection(this.firestore, 'inquiries'), {
        fullName: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() ?? '',
        location: input.location.trim(),
        interest: input.interest,
        message: input.message.trim(),
        source: input.source ?? 'available-page',
        status: 'new',
        questionnaire: input.questionnaire ?? null,
        website: '',
        submittedAt: serverTimestamp(),
      }).then(() => undefined),
    );
  }
}
