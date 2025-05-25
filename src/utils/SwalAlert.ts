import Swal from 'sweetalert2'
class SwalAlert {
  showConfirmDelete() {
    return Swal.fire({
      title: 'Thông báo xóa',
      text: 'Bạn chắc chắn xóa?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa'
    })
  }
  notifySuccess(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'success'
    })
  }
  notifyError(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'error'
    })
  }
}
const swalAlert = new SwalAlert()
export default swalAlert
