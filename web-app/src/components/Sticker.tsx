interface StickerProps {
	text: string
	className: string
}

export default function({text, className}: StickerProps) {
	return <span className={`text-white text-xs p-1 rounded-md mr-1 ${className}`}>{text}</span>
}
