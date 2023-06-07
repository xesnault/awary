import moment from "moment";
import {useState} from "react";
import {useApi} from "../../api";
import Card from "../../components/Card";
import {TinyLogCard} from "../../components/LogCard";
import {Log} from "../../core/Log";
import {Project} from "../../core/Project";
import {TagData} from "../../core/Tag";
import {useModal} from "../../services/ModalService";

interface LogsTabProps {
	className?: string
	project: Project
	logs: Log[]
}

export function TagSticker({tag}: {tag: TagData}) {
	return (
		<div
			className="border border-neutral-400 rounded-md text-xs py-1 px-4"
			style={{color: tag.color, borderColor: tag.color}}
		>
			{tag.name}
		</div>
	)
}

export default function LogsTab({project, logs, className}: LogsTabProps) {
	const modalService = useModal();
	const api = useApi();

	return (
		<div className={`bg-neutral-600 rounded-md ${className}`}>
			<div className="f-c gap-2 m-2">
				<p className="text-left font-bold mb-4">Logs</p>
				{logs.map(log => <TinyLogCard key={log.id} project={project} log={log}/>)}
			</div>
		</div>
	)
}
