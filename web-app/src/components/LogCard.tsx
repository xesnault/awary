import {TrashIcon} from "@heroicons/react/outline";
import moment from "moment";
import {useState} from "react";
import {useApi} from "../api";
import {Log} from "../core/Log";
import {Project} from "../core/Project";
import {TagSticker} from "../pages/projectPage/LogsTab";
import {useModal} from "../services/ModalService";
import {formatTimestamp} from "../utils/formatTimestamp";
import Card from "./Card";

export type LogCardProps = {
	project: Project
	log: Log
	onDelete?: () => void
}

export function LogCard({log, project, onDelete}: LogCardProps) {
	const [showContent, setShowContent] = useState(false);
	const modalService = useModal()
	const api = useApi()

	const tags = log.tags.map(logTag => {
		const projectTag = project.tags.find(projectTag => projectTag.name === logTag)
		return projectTag || {name: logTag, color: "grey"}
	})

	const deleteLog = () => {
		modalService.confirmation("Delete the log ?", async () => {
			await api.deleteLog(log.projectId, log.id)
			onDelete && onDelete();
		})
	}

	const header =
		<div className="f-c gap-2">
			<div className="f-r justify-between items-center">
				<span
					className="text-xl cursor-pointer"
					onClick={() => {setShowContent(!showContent)}}
				>
					{log.title}
				</span>
				<span className="text-neutral-400 text-sm">{formatTimestamp(log.createdAt)}</span>
			</div>
			<div className="f-r justify-between">
				<div className="f-r gap-2">
					{tags.map(tag => <TagSticker tag={tag}/>)}	
				</div>
				<div className="f-r items-center">
					<TrashIcon
						className="w-4 h-4 text-red-300 cursor-pointer"
						onClick={deleteLog}
					/>
				</div>
			</div>
		</div>

	return (
		<Card header={header} hideSeparator={!showContent}>
			{showContent && <p className="text-sm">{log.content}</p>}	
		</Card>
	)
}

export function TinyLogCard({log, project}: LogCardProps) {

	const tags = log.tags.map(logTag => {
		const projectTag = project.tags.find(projectTag => projectTag.name === logTag)
		return projectTag || {name: logTag, color: "grey"}
	})

	return (
		<div className="f-c gap-2">
			<div className="f-r items-stretch">
				<div className="border-l-2 border-neutral-500 pr-2"/>
				<p>{log.title}</p>
				<p className='mt-auto ml-auto text-xs text-neutral-400'>{moment(log.createdAt).format("YYYY-MM-DD hh:mm a")}</p>
			</div>
			<div className="w-full border-b border-neutral-500"/>
		</div>
		
	)
}
