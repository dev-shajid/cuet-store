import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, FC, useState, useEffect } from "react";

// TYPES  
interface ILayoutProps {
  children: ReactNode;
}

const PageTransitionLayout: FC<ILayoutProps> = ({ children }) => {

  const [mutate, setMutate] = useState(false)

  useEffect(() => {
    setMutate(true)
  }, [])

  const router = usePathname();

  if (!mutate) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={router}
        initial={{ opacity: 0, filter: "blur(5px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        // exit={{ opacity: 0, filter: "blur(5px)" }}
        transition={{ duration: .5, }}
        className="w-full" // Feel free to add your classes here  
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransitionLayout;