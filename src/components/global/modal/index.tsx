import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string
  description?: string;
  className?: string;
}

const Modal = ({ trigger, children, title, description, className }: Props) => {
  return (
    <Dialog>
      <DialogTrigger className={cn(className)} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal;