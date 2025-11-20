import React, { useState } from "react";
import "./UserForm.css";

const API_BASE =  "http://127.0.0.1:8000/webhook/employee/"; 

export default function UserTabs() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="fullpage-container">
      
      <div className="tabs-wrapper">
        <div className="tabs-row">
          <button
            className={activeTab === "create" ? "tab active" : "tab"}
            onClick={() => setActiveTab("create")}
          >
            Create User
          </button>

          <button
            className={activeTab === "edit" ? "tab active" : "tab"}
            onClick={() => setActiveTab("edit")}
          >
            Edit User
          </button>

          <button
            className={activeTab === "delete" ? "tab active" : "tab"}
            onClick={() => setActiveTab("delete")}
          >
            Delete User
          </button>
        </div>
      </div>

      
      {activeTab === "create" && <CreateUser />}
      {activeTab === "edit" && <EditUser />}
      {activeTab === "delete" && <DeleteUser />}
    </div>
  );
}

/* ----------------------------------------------------
   HELPER API FUNCTIONS
------------------------------------------------------ */

/**
 * expected API shape:
 * POST   ${API_BASE}/users       -> create
 * GET    ${API_BASE}/users/:id   -> get single user
 * PUT    ${API_BASE}/users/:id   -> update full user
 * DELETE ${API_BASE}/users/:id   -> delete
 *
 * adjust endpoints / headers / auth as required.
 */

async function getUser(user_id) {
  if (!user_id) throw new Error("user_id required");
  const res = await fetch(`${API_BASE}${encodeURIComponent(user_id)}`);
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`GET user failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function createUser(payload) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`Create failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function updateUser(user_id, payload) {
  if (!user_id) throw new Error("user_id required for update");
  const res = await fetch(`${API_BASE}`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`Update failed: ${res.status} ${txt}`);
  }
  return res.json();
}

async function deleteUser(user_id) {
  if (!user_id) throw new Error("user_id required for delete");
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`Delete failed: ${res.status} ${txt}`);
  }
  // return whatever your API returns (some return 204 no content)
  try {
    return await res.json();
  } catch {
    return { success: true };
  }
}

/* ----------------------------------------------------
   CREATE USER COMPONENT (unchanged, slight clean)
------------------------------------------------------ */
function CreateUser() {
  const [form, setForm] = useState({
    event: "user.created",
    timestamp: new Date().toISOString(),
    data: {
      user_id: "",
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      role: "",
      organization: ""
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      timestamp: new Date().toISOString(),
      data: { ...prev.data, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jsonOutput = {
      event: form.event,
      timestamp: new Date().toISOString(),
      data: {
        user_id: form.data.user_id,
        username: form.data.username,
        email: form.data.email,
        password: form.data.password,
        first_name: form.data.first_name,
        last_name: form.data.last_name,
        phone_number: form.data.phone_number,
        role: form.data.role,
        organizations: [
          {
            org_id: form.data.organization,
            role: form.data.role
          }
        ],
        facilities: []
      }
    };

    try {
      const result = await createUser(jsonOutput);
      alert("User created successfully!");
      console.log("API RESULT:", result);
      // optionally clear form:
      setForm((f) => ({ ...f, data: { ...f.data, user_id: "", username: "", email: "", password: "", first_name: "", last_name: "", phone_number: "", role: "", organization: "" } }));
    } catch (error) {
      console.error("API Error:", error);
      alert("Error creating user. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fullpage-card">
      <h2 className="form-title">Create User</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User ID</label>
          <input name="user_id" value={form.data.user_id} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Username *</label>
          <input name="username" value={form.data.username} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={form.data.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input type="password" name="password" value={form.data.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>First Name *</label>
          <input name="first_name" value={form.data.first_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input name="last_name" value={form.data.last_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone_number" value={form.data.phone_number} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Role *</label>
          <select name="role" value={form.data.role} onChange={handleChange} required>
            <option value="">-- Select Role --</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="staff">Staff</option>
            <option value="administrator">Administrator</option>
          </select>
        </div>

        <div className="form-group">
          <label>Organization *</label>
          <select
            name="organization"
            value={form.data.organization}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Organization --</option>
            <option value="org1">Org 1</option>
            <option value="org2">Org 2</option>
            <option value="org3">Org 3</option>
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="submit-container" style={{ gridColumn: "1 / span 2" }}>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------------------------------
   EDIT USER COMPONENT (load by id, edit, update)
------------------------------------------------------ */
function EditUser() {
  const [userIdToLoad, setUserIdToLoad] = useState("");
  const [user, setUser] = useState(null); // will hold fetched user envelope or null
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleLoad(e) {
    e && e.preventDefault();
    if (!userIdToLoad) return alert("Enter user_id to load");
    setLoading(true);
    try {
      const fetched = await getUser(userIdToLoad);
      // normalize to envelope if API returns user object directly:
      const envelope = fetched.data ? fetched : { event: "user.fetched", timestamp: new Date().toISOString(), data: fetched };
      setUser(envelope);
    } catch (err) {
      console.error(err);
      alert("Failed to load user. Check console.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      timestamp: new Date().toISOString(),
      data: { ...prev.data, [name]: value }
    }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!user || !user.data || !user.data.user_id) return alert("Load a user before updating.");
    setSaving(true);

    const payload = {
      event: "user.updated",
      timestamp: new Date().toISOString(),
      data: {
        user_id: user.data.user_id,
        username: user.data.username,
        email: user.data.email,
        password: user.data.password,
        first_name: user.data.first_name,
        last_name: user.data.last_name,
        phone_number: user.data.phone_number,
        role: user.data.role,
        organizations: user.data.organizations || [
          { org_id: user.data.organization || "", role: user.data.role || "" }
        ],
        facilities: user.data.facilities || []
      }
    };

    try {
      const result = await updateUser(user.data.user_id, payload);
      alert("User updated successfully");
      console.log("UPDATE RESULT:", result);
      setUser(result.data ? result : { ...payload }); // prefer API response; fallback to what we sent
    } catch (err) {
      console.error(err);
      alert("Update failed. See console.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fullpage-card">
      <h2 className="form-title">Edit User</h2>

      <form onSubmit={handleLoad} style={{ marginBottom: 16 }}>
        <label>Enter user_id to load:</label>
        <input value={userIdToLoad} onChange={(e) => setUserIdToLoad(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Load"}</button>
      </form>

      {!user && <p>Load a user to begin editing.</p>}

      {user && (
        <form className="form-grid" onSubmit={handleUpdate}>
          <div className="form-group">
            <label>User ID</label>
            <input name="user_id" value={user.data.user_id || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input name="username" value={user.data.username || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={user.data.email || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={user.data.password || ""} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>First Name *</label>
            <input name="first_name" value={user.data.first_name || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input name="last_name" value={user.data.last_name || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone_number" value={user.data.phone_number || ""} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={user.data.role || ""} onChange={handleChange} required>
              <option value="">-- Select Role --</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="staff">Staff</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label>Organization</label>
            <select name="organization" value={user.data.organization || "" } onChange={handleChange} required>
              <option value="">-- Select Organization --</option>
              <option value="org1">Org 1</option>
              <option value="org2">Org 2</option>
              <option value="org3">Org 3</option>
             
            </select>
          </div>

          <div className="submit-container" style={{ gridColumn: "1 / span 2" }}>
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Saving..." : "Update User"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ----------------------------------------------------
   DELETE USER COMPONENT (load by id, then delete)
------------------------------------------------------ */
function DeleteUser() {
  const [userIdToLoad, setUserIdToLoad] = useState("");
  const [userSummary, setUserSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleLoad(e) {
    e && e.preventDefault();
    if (!userIdToLoad) return alert("Enter user_id to load");
    setLoading(true);
    try {
      const fetched = await getUser(userIdToLoad);
      const envelope = fetched.data ? fetched : { event: "user.fetched", timestamp: new Date().toISOString(), data: fetched };
      setUserSummary(envelope);
    } catch (err) {
      console.error(err);
      alert("Failed to load user. Check console.");
      setUserSummary(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e) {
    e && e.preventDefault();
    if (!userSummary || !userSummary.data || !userSummary.data.user_id) return alert("Load a user first");
    if (!confirm(`Delete user ${userSummary.data.user_id}? This action cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await deleteUser(userSummary.data.user_id);
      alert("User deleted successfully");
      console.log("DELETE RESULT:", res);
      setUserSummary(null);
      setUserIdToLoad("");
    } catch (err) {
      console.error(err);
      alert("Delete failed. Check console.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fullpage-card">
      <h2 className="form-title">Delete User</h2>

      <form onSubmit={handleLoad} style={{ marginBottom: 16 }}>
        <label>Enter user_id to load:</label>
        <input value={userIdToLoad} onChange={(e) => setUserIdToLoad(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Load"}</button>
      </form>

      {!userSummary && <p>Load a user to see details and delete.</p>}

      {userSummary && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <strong>User ID:</strong> {userSummary.data.user_id} <br />
            <strong>Name:</strong> {`${userSummary.data.first_name || ""} ${userSummary.data.last_name || ""}`} <br />
            <strong>Email:</strong> {userSummary.data.email} <br />
            <strong>Role:</strong> {userSummary.data.role} <br />
            <strong>Organizations:</strong> {(userSummary.data.organizations || []).map(o => o.org_id).join(", ")} <br />
          </div>

          <button onClick={handleDelete} disabled={deleting} className="submit-btn">
            {deleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      )}
    </div>
  );
}
