import { DataGrid } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../App';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';


const columns = [
  { field: 'id', headerName: 'ID', width: 50, sortable: true },
  { field: 'firstName', headerName: 'First Name', width: 100 },
  { field: 'lastName', headerName: 'Last Name', width: 100 },
  { field: 'email', headerName: 'Email', width: 170 },
  { field: 'business', headerName: 'Business', width: 170, format: (value) => value.toString() },
  { field: 'manage', headerName: 'manage', width: 170, sortable: false, filterable: false},
];

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const { setLoading, snackbar } = useContext(GeneralContext);


  useEffect(() => {
    fetch(`https://api.shipap.co.il/admin/clients?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setClients(data);
      })
      .catch(err => snackbar(err))
      .finally(() => {
       const clients2 = clients.map(client => {
          return {...client, manage: <div>

            <IconButton className='trash-icon' onClick={() => deleteClient(client.id)} aria-label="delete">
              <DeleteIcon style={{ color: "grey" }} />
            </IconButton>

            <IconButton className='edit-icon' aria-label="edit">
              <Link to={`/admin/clients/${client.id}`} style={{ textDecoration: 'none', color: 'grey', height: '24px' }}><EditIcon /></Link>
            </IconButton>

          </div> }
        }
        )

        setClients(clients2);
    })
  }, [])

  const deleteClient = (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }
    setLoading(true);
    fetch(`https://api.shipap.co.il/admin/clients/${id}?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(() => {
      setClients(clients.filter(c => c.id !== id));
      snackbar("Client removed successfully");
    })
    .catch(err => console.log(err))
    .finally(() =>setLoading(false));
  };


  return (
    <div style={{ height: 900, width: '100%' }}>
      <DataGrid
        rows={clients}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
      />
    </div>
  );
}