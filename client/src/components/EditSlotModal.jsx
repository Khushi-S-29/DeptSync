import { FiX, FiUser, FiBook, FiUsers, FiClock } from "react-icons/fi";

const EditSlotModal = ({ isOpen, onClose, onSave, form, setForm, isSuper, departments }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-modal">
        <div className="modal-header">
          <h3><FiClock /> {form.isRequest ? "Request Slot" : "Modify Slot"}</h3>
          <button onClick={onClose} className="close-btn"><FiX /></button>
        </div>
        
        <div className="modal-body">
          {isSuper && !form.existing && (
            <div className="input-group">
              <label><FiLayers /> Department</label>
              <select 
                value={form.dept_id} 
                onChange={(e) => setForm({...form, dept_id: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}

          <div className="input-group">
            <label><FiBook /> Subject Name</label>
            <input 
              type="text" 
              placeholder="e.g. Data Structures"
              value={form.subject} 
              onChange={(e) => setForm({...form, subject: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label><FiUser /> Professor</label>
            <input 
              type="text" 
              placeholder="e.g. Dr. Smith"
              value={form.professor_name} 
              onChange={(e) => setForm({...form, professor_name: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label><FiUsers /> Batch / Section</label>
            <input 
              type="text" 
              placeholder="e.g. CS-A / 3rd Year"
              value={form.batch_name} 
              onChange={(e) => setForm({...form, batch_name: e.target.value})}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave}>
            {form.isRequest ? "Submit Request" : "Update Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
};