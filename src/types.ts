export interface Photo {
  id: string;
  title: string;
  category: 'Landscape' | 'Architecture' | 'Street' | 'Portrait';
  imageUrl: string;
  location: string;
  date: string;
  camera: string;
  lens: string;
  shutter: string;
  aperture: string;
  iso: string;
  focalLength: string;
  story: string;
}

export interface InquiryFormState {
  fullName: string;
  email: string;
  message: string;
  photoId?: string; // Opt-in reference to a photo for prints
  printSize?: '8x12' | '12x18' | '16x24' | '24x36';
}
