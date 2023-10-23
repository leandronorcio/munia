export default function Page({ params }: { params: { username: string } }) {
  console.log(params.username);
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
          alt=""
        />
      </div>

      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg"
          alt=""
        />
      </div>
      <div>
        <img
          className="h-full w-full object-cover"
          src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"
          alt=""
        />
      </div>
    </div>
  );
}
