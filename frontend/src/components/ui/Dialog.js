import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/Utils';

const Dialog = ({ children, ...props }) => {
    return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
};

const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = DialogPrimitive.Content;
const DialogHeader = DialogPrimitive.Header;
const DialogTitle = DialogPrimitive.Title;

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };
