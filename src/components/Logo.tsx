import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const sizeConfig = {
  sm: { width: 24, height: 24, textSize: 'text-sm' },
  md: { width: 32, height: 32, textSize: 'text-lg' },
  lg: { width: 48, height: 48, textSize: 'text-2xl' },
  xl: { width: 64, height: 64, textSize: 'text-3xl' }
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: LogoProps) {
  const config = sizeConfig[size]
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Image
          src="/logo vet card.png"
          alt="VetCard Logo"
          width={config.width}
          height={config.height}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={`font-bold text-foreground ${config.textSize}`}>
          VET CARD
        </span>
      )}
    </div>
  )
}
