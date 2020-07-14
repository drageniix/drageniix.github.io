import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
} from "../gateway/persistence";
import BudgetInstitution, {
  BudgetInstitutionInternalProperties,
} from "../models/Institution";

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
): Promise<BudgetInstitution[]> => {
  const query = userRef
    .collection(CollectionTypes.INSTITUTION)
    .where("active", "==", true);

  return query
    .get()
    .then((institutions) =>
      institutions.docs.map((snapshot) => createInstitution({ snapshot }))
    );
};

export const getInstitutionReferenceById = (
  userRef: DocumentReference,
  institution: documentReferenceType
): DocumentReference => {
  return getDocumentReference(
    userRef,
    institution,
    CollectionTypes.INSTITUTION
  );
};
