export interface TeamCard extends BusinessCard {
  department?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}
