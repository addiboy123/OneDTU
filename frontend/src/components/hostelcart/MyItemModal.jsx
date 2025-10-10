"use client"

import { useState } from "react"
import { X, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import getDecodedToken from "../../lib/auth"
import api from "../../api/interceptor"

let userId = ""
try {
  userId = getDecodedToken().userId
} catch (error) {
  console.error("Error getting user ID:", error)
}

export function MyItemModal({ isOpen, onClose, item, onUpdateItem, onDeleteItem }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletedImages, setDeletedImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [sliderIndex, setSliderIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)


  if (!item) return null

  const handleEdit = () => {
    setIsEditing(true)
    setEditedItem({
      itemName: item.itemName || "",
      itemDescription: item.itemDescription || "",
      itemPrice: item.itemPrice || 0,
      itemPictures: [...item.itemPictures] || [],
      _id: item._id,
    })
  }

  const handleSave = async () => {
    if (!editedItem) return

    setIsSaving(true) // Start loading

    const formData = new FormData()
    formData.append("userId", userId)
    formData.append("itemId", item._id)
    formData.append("itemName", editedItem.itemName)
    formData.append("itemDescription", editedItem.itemDescription)
    formData.append("itemPrice", editedItem.itemPrice)
    deletedImages.forEach((img) => formData.append("deletedImages[]", img))
    newImages.forEach((file) => formData.append("updatedImages", file))

    try {
      const response = await api.patch("/hostelcart/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      // console.log("Updated item:", response.data.message);
      onUpdateItem(response.data.item)
      setIsEditing(false)
      setDeletedImages([])
      setNewImages([])
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Failed to update item. Please try again.")
    }
    finally {
      setIsSaving(false) // Stop loading
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedItem(null)
    setDeletedImages([])
    setNewImages([])
  }

  const handleDelete = () => setIsDeleteDialogOpen(true)

  const confirmDelete = async () => {
    try {
      await api.delete("/hostelcart/items", {
        data: { userId, itemId: item._id },
      })
      onDeleteItem(item._id)
      onClose()
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item. Please try again.")
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleToggleImageDelete = (imgUrl) => {
    if (deletedImages.includes(imgUrl)) {
      // Deselect image for deletion
      setDeletedImages(deletedImages.filter((img) => img !== imgUrl))
    } else {
      // Select image for deletion
      setDeletedImages([...deletedImages, imgUrl])
    }
  }


  const handleRemoveNewImage = (index) => {
    const updated = [...newImages]
    updated.splice(index, 1)
    setNewImages(updated)
  }

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files)
    setNewImages([...newImages, ...files])
  }

  const prevSlide = () => setSliderIndex((prev) => (prev === 0 ? item.itemPictures.length - 1 : prev - 1))
  const nextSlide = () => setSliderIndex((prev) => (prev === item.itemPictures.length - 1 ? 0 : prev + 1))

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1000px] max-h-[1000px] overflow-auto bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Item" : ""}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 h-full">
            {/* Image Section */}
            <div className="flex flex-col h-full">
              {isEditing ? (
                <div className="flex flex-col">
                  {/* Horizontal scroll container */}
                  <div className="flex space-x-3 overflow-x-auto py-2 max-w-full">
                    {editedItem.itemPictures.map((img, idx) => {
                      const isDeleted = deletedImages.includes(img)
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleImageDelete(img)}
                          className={`relative cursor-pointer rounded-md overflow-hidden aspect-square w-28 flex-shrink-0 ${isDeleted ? "scale-75 opacity-50" : "scale-100 opacity-100"
                            }`}
                        >
                          <img
                            src={img}
                            alt={`img-${idx}`}
                            className="w-full h-full object-cover block"
                          />
                          {isDeleted && (
                            <div className="absolute inset-0 bg-white bg-opacity-40 flex items-center justify-center rounded-md">
                              <X className="w-6 h-6 text-red-600" />
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {newImages.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="relative rounded-md overflow-hidden aspect-square w-28 flex-shrink-0"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`new-${idx}`}
                          className="w-full h-full object-cover block"
                        />
                        <button
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Image button below the scroll */}
                  <label
                    className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-md cursor-pointer bg-white p-4 mt-3"
                  >
                    <Plus className="w-6 h-6" />
                    <input type="file" multiple onChange={handleAddImage} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    pagination={{ clickable: true }}
                    navigation={{
                      nextEl: ".custom-next", // Left button moves forward
                      prevEl: ".custom-prev", // Right button moves backward
                    }}
                    className="w-full rounded-lg border border-gray-200 shadow-sm"
                  >
                    {(item.itemPictures.length > 0 ? item.itemPictures : ["/placeholder.svg"]).map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Reversed Navigation Arrows */}
                  <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 backdrop-blur-md bg-white/30 text-black p-3 rounded-full shadow-md hover:bg-white/50 transition-all">
                    <ChevronLeft className="w-7 h-7 text-gray-900" />
                  </button>
                  <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 backdrop-blur-md bg-white/30 text-black p-3 rounded-full shadow-md hover:bg-white/50 transition-all">
                    <ChevronRight className="w-7 h-7 text-gray-900" />
                  </button>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="flex flex-col justify-between h-full">
              {isEditing ? (
                <div className="space-y-4">
                  <Input value={editedItem?.itemName} onChange={(e) => setEditedItem({ ...editedItem, itemName: e.target.value })} />
                  <Textarea value={editedItem?.itemDescription} onChange={(e) => setEditedItem({ ...editedItem, itemDescription: e.target.value })} rows={5} />
                  <Input type="number" value={editedItem?.itemPrice} onChange={(e) => setEditedItem({ ...editedItem, itemPrice: parseFloat(e.target.value) })} />
                  <div className="flex space-x-2">
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>

                    <Button className="bg-red-500 text-white hover:bg-red-600" variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center h-full space-y-6 p-2">
                  <div className="space-y-4">
                    {/* Item Name Box */}
                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 break-words">{item.itemName}</h2>
                    </div>

                    {/* Item Price Box */}
                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200">
                      <p className="text-lg font-semibold text-gray-800">₹{item.itemPrice?.toFixed(2)}</p>
                    </div>

                    {/* Item Description Box */}
                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200 max-h-48 overflow-y-auto">
                      <p className="text-gray-700 whitespace-pre-line break-words">{item.itemDescription}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-auto">
                    <Button className="bg-gray-800 text-white hover:bg-gray-700" onClick={handleEdit}>
                      Edit Item
                    </Button>
                    <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>


              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default MyItemModal;
