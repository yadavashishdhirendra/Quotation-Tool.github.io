import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './MetaData';
import './CreateInvoice.css'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getSingleInvoice, updateInvoice } from '../actions/Invoiceaction';
import DeleteIcon from '@material-ui/icons/Delete';
import Loader from './Loader/Loader';
import { Button } from '@material-ui/core'
import PlusIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import { INVOICE_UPDATE_RESET } from '../constants/InvoiceConstants';
import RightIcon from '@material-ui/icons/ChevronRight'
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

const UpdateInvoice = ({ match }) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const history = useHistory();
    const { getInvoice } = useSelector((state) => state.InvoiceDetails);
    const { error, loading, isUpdated } = useSelector((state) => state.deleteInvoice)
    const [items, setItems] = useState([])

    // const [itemname, itemdesc, itemsize, itemuom, itemqty, itemprice] = productss;
    const userTemplate = { itemname: "", itemdesc: "", itemsize: "", itemuom: "", itemqty: "", itemprice: "" }
    const [contact, setContact] = useState("");
    const [to, setTo] = useState("");
    const [companyname, setCompanyName] = useState("");
    const [revisionnumber, setRevisionNumber] = useState("");
    const [customerrefno, setCustomerRefNo] = useState("");
    const [projectname, setProjectName] = useState("");
    const [kindatt, setKindAtt] = useState("");
    const [validity, setValidity] = useState(null);
    const [products, setProducts] = useState([userTemplate]);
    const onchange = (e, index) => {
        const addproduct = products.map((product, i) => index == i ? Object.assign(product, { [e.target.name]: e.target.value }) : product)
        setProducts(addproduct)
        const addproducts = products.map((product, i) => index == i ? Object.assign(product, { [e.target.name]: e.target.value }) : product)
        setItems(addproducts)
    }

    const addField = (e) => {
        e.preventDefault();
        setProducts([...products, userTemplate])
    }

    const minusField = (index, e) => {
        const filterProducts = [...products];
        filterProducts.splice(index, 1);
        setProducts(filterProducts)
        e.preventDefault();
    }

    const invoiceId = match.params.id

    const handleInvoiceUpdate = (e) => {
        e.preventDefault();
        dispatch(updateInvoice(invoiceId, companyname, revisionnumber, customerrefno, projectname, kindatt, to, contact, validity, products, items));
    }

    useEffect(() => {
        if (getInvoice && getInvoice._id !== invoiceId) {
            dispatch(getSingleInvoice(invoiceId))
        }
        else {
            setTo(getInvoice.to)
            setCompanyName(getInvoice.companyname)
            setProducts(getInvoice.products)
            setKindAtt(getInvoice.kindatt)
            setCustomerRefNo(getInvoice.customerrefno)
            setRevisionNumber(getInvoice.revisionnumber)
            setProjectName(getInvoice.projectname)
            setValidity(getInvoice.validity)
            setContact(getInvoice.contact)
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success("Invoice Updated Success")
            history.push('/invoice-list')
            dispatch({
                type: INVOICE_UPDATE_RESET
            })
        }
    }, [dispatch, error, getInvoice, alert, isUpdated, invoiceId, history])
    return (
        <div className="container quotation-updation">
            {
                loading ? <Loader /> :
                    <Fragment>
                        <div className='breadcrumb'>
                            <p><Link to='/invoice-list'>Quotation List</Link> <span><RightIcon /></span> <span>Update Quotation</span></p>
                        </div>
                        <h1 className='text-center head-text'>Upda<span>te Quo</span>tation</h1>
                        <MetaData title={`${getInvoice.companyname} - Update Invoice`} />
                        <form onSubmit={handleInvoiceUpdate}>
                            <div className='Header-inputs'>
                                <div>
                                    <label htmlFor="">To -</label>
                                    <input className='mb-4' name='to' value={to} onChange={(e) => setTo(e.target.value)} type="text" placeholder='To *' /> <br />
                                    <label htmlFor="">Company Name -</label>
                                    <input className='mb-4' name='companyname' value={companyname} onChange={(e) => setCompanyName(e.target.value)} type="text" placeholder='Company Name' /> <br />
                                    <label htmlFor="">Kind Att -</label>
                                    <input className='mb-4' name='kindatt' value={kindatt} onChange={(e) => setKindAtt(e.target.value)} type="text" placeholder='Kind Att' />
                                    <label htmlFor="">Contact No -</label>
                                    <input className='mb-4' name='contact' value={contact} onChange={(e) => setContact(e.target.value)} type="number" placeholder='Contact No *' /> <br />
                                </div>
                                <div>
                                    <label htmlFor="">Revision Number -</label>
                                    <input value={revisionnumber} name="revisionnumber" onChange={(e) => setRevisionNumber(e.target.value)} className='mb-4' type="number" placeholder='Revision Number' />
                                    <label htmlFor="">Customer Ref No -</label>
                                    <input value={customerrefno} name="customerrefno" onChange={(e) => setCustomerRefNo(e.target.value)} className='mb-4' type="number" placeholder='Customer Ref Number' />
                                    <label htmlFor="">Validity -</label>
                                    <input type="date" name="validity" value={validity} className='mb-4' onChange={(e) => setValidity(e.target.value)} />
                                    <label htmlFor="">Project Name -</label>
                                    <input value={projectname} name="projectname" onChange={(e) => setProjectName(e.target.value)} className='mb-4' type="text" placeholder='Project Name' />
                                </div>
                            </div>
                            <div className="container products-container">
                                <label htmlFor="">Add Products -</label>
                            </div>
                            <div className='project-Input-Head'>
                                {
                                    products.map((product, index) => {
                                        return (
                                            <div className='project-Inputs' key={index}>
                                                <div>
                                                    <select className='mb-3' name='itemname' value={product.itemname} onChange={(e) => onchange(e, index)}>
                                                        <option value="">Choose Products</option>
                                                        <option value="Product 1">Product 1</option>
                                                        <option value="Product 2">Product 2</option>
                                                        <option value="Product 3">Product 3</option>
                                                        <option value="Product 4">Product 4</option>
                                                        <option value="Product 5">Product 5</option>
                                                        <option value="Product 6">Product 6</option>
                                                        <option value="Product 7">Product 7</option>
                                                        <option value="Product 8">Product 8</option>
                                                        <option value="Product 9">Product 9</option>
                                                        <option value="Product 10">Product 10</option>
                                                    </select>
                                                    {/* <input className='mb-3' value={product.itemname} name="itemname" onChange={(e) => onchange(e, index)} type="text" placeholder='Item Name' /> */}
                                                </div>
                                                <div>
                                                    <input className='mb-3' value={product.itemdesc} name="itemdesc" onChange={(e) => onchange(e, index)} type="text" placeholder='Item Description' />
                                                </div>
                                                <div>
                                                    <input className='mb-3' value={product.itemsize} name="itemsize" onChange={(e) => onchange(e, index)} type="text" placeholder='Size mm' />
                                                </div>
                                                <div>
                                                    <input className='mb-3' value={product.itemuom} name="itemuom" onChange={(e) => onchange(e, index)} type="text" placeholder='UOM' />
                                                </div>
                                                <div>
                                                    <input className='mb-3' value={product.itemqty} name="itemqty" onChange={(e) => onchange(e, index)} type="number" placeholder='Quantity' />
                                                </div>
                                                <div>
                                                    <input className='mb-3' value={product.itemprice} name="itemprice" onChange={(e) => onchange(e, index)} type="number" placeholder='Price' />
                                                </div>
                                                <div>
                                                    <select className='mb-3' name='pricesign' value={product.pricesign} onChange={(e) => onchange(e, index)}>
                                                        <option value="">Choose Currency</option>
                                                        <option value='₹'>₹</option>
                                                        <option value='＄'>＄</option>
                                                    </select>
                                                </div>
                                                <Tooltip arrow title="Delete Field"><Button className='minus-field' variant="contained" onClick={() => minusField(index)}><DeleteIcon /></Button></Tooltip>
                                            </div>
                                        )
                                    })
                                }
                                <div className='text-center'>
                                    <Tooltip arrow title="Add Field"><Button className='add-more mt-3' variant="contained" onClick={addField}><PlusIcon /></Button></Tooltip>
                                </div>
                                <Button type='submit' variant="contained" className='submit-button mt-5'>Update Quotation &nbsp; <SendIcon /></Button>
                            </div>
                        </form>
                    </Fragment>
            }
        </div>
    )
}

export default UpdateInvoice