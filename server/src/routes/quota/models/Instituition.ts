import { firestore } from "firebase-admin";
import {
  filterUndefinedProperties,
  FireBaseModel,
} from "../middleware/firebase";

export default class BudgetInstitution extends FireBaseModel {
  id?: firestore.DocumentReference;
  name: string;
  note?: string;
  active: boolean;
  plaidItemId: string;
  plaidAccessToken: string;

  constructor({
    explicit,
    snapshot,
  }: {
    explicit?: BudgetInstitutionInternalProperties;
    snapshot?: firestore.DocumentSnapshot;
  }) {
    super({
      explicit,
      snapshot,
    });

    const { name, note, active, plaidItemId, plaidAccessToken } =
      explicit || snapshot.data();

    this.name = name;
    this.note = note;
    this.active = active || true;
    this.plaidItemId = plaidItemId;
    this.plaidAccessToken = plaidAccessToken;
  }

  toFireStore(): BudgetInstitutionInternalProperties {
    return filterUndefinedProperties({
      name: this.name,
      note: this.note,
      active: this.active,
      plaidItemId: this.plaidItemId,
      plaidAccessToken: this.plaidAccessToken,
    });
  }

  getFormattedResponse(): BudgetInstitutionDisplayProperties {
    return filterUndefinedProperties({
      id: this.id && this.id.id,
      name: this.name,
      note: this.note,
      active: this.active,
    });
  }

  setLinkedValues(): void {
    return;
  }

  async post(
    userInstitutionRef: firestore.CollectionReference
  ): Promise<BudgetInstitution> {
    await super.post(userInstitutionRef);
    return this;
  }
}

type BudgetInstitutionInternalProperties = {
  id?: firestore.DocumentReference;
  name?: string;
  note?: string;
  active?: boolean;
  plaidItemId?: string;
  plaidAccessToken?: string;
};

type BudgetInstitutionDisplayProperties = {
  id?: string;
  name?: string;
  note?: string;
  active?: boolean;
  plaidItemId?: string;
  plaidAccessToken?: string;
};
