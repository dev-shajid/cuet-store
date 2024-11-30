import { Dialog, DialogOverlay } from "./ui/dialog";


export function LoadingOverlay({ open = false }: { open?: boolean }) {
  return (
    <Dialog open={open}>
      <DialogOverlay>
      </DialogOverlay>
    </Dialog>
  )
}
