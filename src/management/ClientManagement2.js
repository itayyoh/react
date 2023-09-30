import { IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GeneralContext } from '../App';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50, sortable: true },
  { id: 'firstName', label: 'First Name', minWidth: 100 },
  { id: 'lastName', label: 'Last Name', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'business', label: 'Business', minWidth: 170, format: (value) => value.toString() },
  { id: 'manage', label: '', minWidth: 170 },
];


export default function ClientManagement() {

  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [clientsPerPage, setClientsPerPage] = useState(10);
  const { setLoading, snackbar } = useContext(GeneralContext);


  useEffect(() => {
    fetch(`https://api.shipap.co.il/admin/clients?token=7b55a184-44b6-11ee-ba96-14dda9d4a5f0`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setClients(data);
      })
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeClientsPerPage = (event) => {
    setClientsPerPage(+event.target.value);
    setPage(0);
  };

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
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 1200 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients
              .slice(page * clientsPerPage, page * clientsPerPage + clientsPerPage)
              .map((client) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={client.id}>
                    {columns.map((column) => {
                      const value = client[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {console.log(client.id)}
                          {column.id === "manage" ?
                            <div>

                              <IconButton className='trash-icon' onClick={() => deleteClient(client.id)} aria-label="delete">
                                <DeleteIcon style={{ color: "grey" }} />
                              </IconButton>

                              <IconButton className='edit-icon' aria-label="edit">
                                <Link to={`/admin/clients/${client.id}`} style={{ textDecoration: 'none', color: 'grey', height: '24px' }}><EditIcon /></Link>
                              </IconButton>

                            </div> : ""}
                          {column.format && typeof value === 'boolean'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        rowsPerPage={clientsPerPage}
        count={clients.length}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeClientsPerPage}
      />
    </Paper>
  );
}