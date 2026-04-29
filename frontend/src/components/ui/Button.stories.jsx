// frontend/src/components/ui/Button.stories.jsx
import Button from './Button';
import { FiCamera, FiPlay, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

export default {
  title: 'UI/Button',
  component: Button,
};

export const Variants = () => (
  <div className="flex gap-3 flex-wrap p-4">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="success">Success</Button>
    <Button variant="warning">Warning</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex gap-3 items-center flex-wrap p-4">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" iconLeft={<FiX />}>✕</Button>
  </div>
);

export const WithIcons = () => (
  <div className="flex gap-3 flex-wrap p-4">
    <Button iconLeft={<FiCamera />}>View Cameras</Button>
    <Button variant="primary" iconLeft={<FiPlay />}>Start Recording</Button>
    <Button variant="danger" iconLeft={<FiAlertCircle />}>Trigger Alert</Button>
    <Button variant="success" iconRight={<FiCheck />}>Acknowledge</Button>
  </div>
);

export const Loading = () => (
  <div className="flex gap-3 p-4">
    <Button loading>Processing</Button>
    <Button variant="primary" loading>Saving...</Button>
  </div>
);