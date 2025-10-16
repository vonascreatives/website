import { Metadata } from 'next';
import ErrorMain from '@/_pages/error/error-main'
 
export const metadata: Metadata = {
  title: "Vonas Media - Page Not Found",
};

export default function NotFound() {
  return (
    <ErrorMain/>
  )
}
