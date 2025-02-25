export interface IDogInformation {
  id: string;
  url?: string;
  height: number;
  width: number;
  breeds?: Breed[];
}

export interface Breed {
  weight: {
    imperial: string;
    metric: string;
  };
  height: {
    imperial: string;
    metric: string;
  };
  id: number;
  name: string;
  country_code: string;
  bred_for: string;
  breed_group: string;
  life_span: string;
  temperament: string;
  reference_image_id: string;
}

export interface VotePayload {
  image_id: string;
  sub_id: string;
  value: number;
}

export type Actions = 'like' | 'dislike' | 'super_like';
