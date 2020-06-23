import { firestore } from "firebase-admin";

export default class BudgetCategory {
  id: firestore.DocumentReference;
  goalCreationMonth: Date;
  goalTarget: number;
  goalTargetMonth: Date;
  goalType: string;
  groupId: firestore.DocumentReference;
  groupName: string;
  hidden: boolean;
  name: string;
  note: string;

  constructor({
    id,
    goalCreationMonth,
    goalTarget,
    goalTargetMonth,
    goalType,
    groupId,
    groupName,
    hidden,
    name,
    note,
  }: {
    id: firestore.DocumentReference;
    goalCreationMonth: Date;
    goalTarget: number;
    goalTargetMonth: Date;
    goalType: string;
    groupId: firestore.DocumentReference;
    groupName: string;
    hidden: boolean;
    name: string;
    note: string;
  }) {
    this.id = id;
    this.goalCreationMonth = goalCreationMonth;
    this.goalTarget = goalTarget;
    this.goalTargetMonth = goalTargetMonth;
    this.goalType = goalType;
    this.groupId = groupId;
    this.groupName = groupName;
    this.hidden = hidden;
    this.name = name;
    this.note = note;
  }
}

export const categoryConverter = {
  toFirestore: (category: BudgetCategory): object => ({
    goalCreationMonth: category.goalCreationMonth,
    goalTarget: category.goalTarget,
    goalTargetMonth: category.goalTargetMonth,
    goalType: category.goalType,
    groupId: category.groupId,
    groupName: category.groupName,
    hidden: category.hidden,
    name: category.name,
    note: category.note,
  }),
  fromFirestore: (snapshot: firestore.DocumentSnapshot): BudgetCategory => {
    const data: any = snapshot.data();
    return new BudgetCategory({
      ...data,
      id: snapshot.ref,
      goalCreationMonth: data.goalCreationMonth.toDate(),
      goalTargetMonth: data.goalTargetMonth.toDate(),
    });
  },
};
