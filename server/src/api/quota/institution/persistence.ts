import { BudgetInstitution, BudgetInstitutionInternalProperties } from ".";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../gateway/persistence";

export const createInstitution = (parameters: {
  explicit?: BudgetInstitutionInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetInstitution => new BudgetInstitution(parameters);

export const postInstitution = async (
  institution: BudgetInstitution
): Promise<BudgetInstitution> => {
  await postModelToCollection(
    institution,
    institution.userId.collection(CollectionTypes.INSTITUTION)
  );
  return institution;
};

export const createAndPostInstitution = async (
  explicit: BudgetInstitutionInternalProperties
): Promise<BudgetInstitution> =>
  postInstitution(createInstitution({ explicit }));

export const getAllInstitutions = async (
  userRef: DocumentReference
): Promise<BudgetInstitution[]> =>
  userRef
    .collection(CollectionTypes.INSTITUTION)
    .where("active", "==", true)
    .get()
    .then((institutions) =>
      institutions.docs.map((snapshot) => createInstitution({ snapshot }))
    );

export const updateInstitution = async (
  institution: BudgetInstitution,
  {
    updatedAt,
  }: {
    updatedAt?: Date;
  }
): Promise<BudgetInstitution> => {
  institution.updatedAt = updatedAt || institution.updatedAt;
  await updateModel(institution);
  return institution;
};

export const getInstitutionReferenceById = (
  userRef: DocumentReference,
  institution: documentReferenceType
): DocumentReference =>
  getDocumentReference(userRef, institution, CollectionTypes.INSTITUTION);

export const getInstitution = async (
  userRef: DocumentReference,
  institutionId: documentReferenceType
): Promise<BudgetInstitution> =>
  getInstitutionReferenceById(userRef, institutionId)
    .get()
    .then((institution) => createInstitution({ snapshot: institution }));
