import { useAppStore } from '../store/useAppStore';
import { ASSIGNEES } from '../constants/roles';

export default function AssignmentDropdown({ request }) {
  const role = useAppStore(state => state.role);
  const updateRequest = useAppStore(state => state.updateRequest);
  const showToast = useAppStore(state => state.showToast);

  const disabled = role !== 'IT Admin';

  const handleChange = (e) => {
    const newAssignee = e.target.value;
    updateRequest(request.id, { assignedTo: newAssignee });
    showToast(`${request.id} assigned to ${newAssignee}.`);
  };

  return (
    <select 
      className="assignment-dropdown" 
      value={request.assignedTo} 
      onChange={handleChange}
      disabled={disabled}
    >
      {ASSIGNEES.map(name => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
  );
}
