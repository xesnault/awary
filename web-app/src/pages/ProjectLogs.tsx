import {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useApi} from "../api";
import Button from "../components/Button";
import {LogCard} from "../components/LogCard";
import {ProjectSideBar} from "../components/ProjectSideBar";
import {Log} from "../core/Log";
import {Project} from "../core/Project";
import {useModal} from "../services/ModalService";
import {TagsSettings} from "./projectPage/TagsSettings";

export default function ProjectLogsPage() {
	
	const api = useApi();
	const modalService = useModal();
	const navigate = useNavigate()
	const {projectId} = useParams();
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const [project, setProject] = useState<Project | null>(null);
	const [logs, setLogs] = useState<Log[]>([]);

	const fetchProject = useCallback(async () => {
		const project = await api.fetchProject(projectId as string);
		setProject(project);
		const logs = await api.fetchProjectLogs(projectId as string);
		setLogs(logs);
	}, [projectId, api])

	const onLogDeleted = () => {
		fetchProject();
	}

	useEffect(() => {fetchProject()}, [fetchProject])

	if (!project) {
		return <div>Loading project...</div>
	}

	return (
		<div className="flex-1 f-c gap-4">
			<h2 className="text-left text-3xl font-bold pb-4 border-b border-neutral-600">Logs</h2>
			{/*<Button*/}
				{/*text="Tags"*/}
				{/*onClick={() => modalService.addModal((close) => <TagsSettings project={project} onUpdate={() => {fetchProject()}}/>)}*/}
			{/*/>*/}
			<div className={`flex flex-col rounded-md gap-2 overflow-scroll`}>
				{logs.map(log => <LogCard key={log.id} project={project} log={log} onDelete={onLogDeleted}/>)}
			</div>
		</div>
	)
}
