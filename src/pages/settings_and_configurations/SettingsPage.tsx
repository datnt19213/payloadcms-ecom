import React, {Suspense, useEffect, useState} from "react";
import {
  GridCol2,
  GridCol3,
  ManagementContainer,
} from "../../components/container";
import {FormSlider, FormSocialLinks} from "../../components/particals";
import {TextField, UploadField} from "../../components/fields";
import {SocialLink} from "../../types";
import {Input} from "../../components/ui/input";
import axios from "axios";
import {Button} from "../../components/ui/button";
import {GetStatusColor, RenameFile} from "../../utils";
import {toast, ToastContainer} from "react-toastify";
import {NoDataAvailable} from "../../components/empty";
import {useAuth} from "payload/components/utilities";
import {AddNewDashedLineButton} from "../../components/elements";
import {ChevronDown, Loader2, Plus, Trash} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {notify} from "../../components/toast";
import {PreviewFile} from "../../components/fields/UploadField";
import {Label} from "../../components/ui/label";
import {Styles} from "../../common/data";

// #region interface api response
interface SettingForm {
  id?: number;
  site_name?: string;
  logo?: any;
  primary_color?: string;
  secondary_color?: string;
  contact_email?: string;
  social_links?: Sociallink[];
  sliders?: Sliders[];
  // external_url_configurations?: Externalurlconfigurations;
  updatedAt?: string;
  createdAt?: string;
}

// interface Externalurlconfigurations {
//   url_name?: string;
//   url?: string;
// }

interface Sociallink {
  id?: string;
  name?: string;
  url?: string;
  logo?: any;
}
interface Sliders {
  title?: string;
  subtitle?: string;
  color?: string;
  url?: string;
  image?: any;
}
interface User {
  id: number;
  email: string;
  token: string;
}

// #endregion

const SettingsPage = () => {
  const {user} = useAuth<User>();
  // #region useStates variables
  const [settingData, setSettingData] = useState<SettingForm>(null);

  const [siteName, setSiteName] = useState<string>("");
  const [logo, setLogo] = useState(null);
  const [primaryColor, setPrimaryColor] = useState<string>("#000000");
  const [secondaryColor, setSecondaryColor] = useState<string>("#000000");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [sliders, setSliders] = useState<Sliders[]>([]);
  const [countName, setCountName] = useState(0);

  const [loading, setLoading] = useState(false);
  const [showSocial, setShowSocial] = useState([]);
  const [showSlider, setShowSlider] = useState(false);

  // #endregion

  // #region Get settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "/api/globals/settings?locale=en&depth=4"
        );
        if (response.data) {
          setSettingData(response?.data);
          setSiteName(response?.data?.site_name);
          setLogo(response?.data?.logo);
          setPrimaryColor(response?.data?.primary_color);
          setSecondaryColor(response?.data?.secondary_color);
          setContactEmail(response?.data?.contact_email);
          setSocialLinks(response?.data?.social_links);
          setSliders(response?.data?.sliders);
          setCountName(response?.data?.site_name.length);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);
  // #endregion

  // #region onChange functions get data
  const handleSiteNameChange = (val: any) => {
    if (val.length > 0 && val.length <= 70) {
      setCountName(val.length);
      setSiteName(val);
    }
  };

  const handleLogoChange = (val: any) => {
    setLogo(val);
  };

  const handlePrimaryColorChange = (val: any) => {
    setPrimaryColor(val.target.value);
  };

  const handleSecondaryColorChange = (val: any) => {
    setSecondaryColor(val.target.value);
  };

  const handleContactEmailChange = (val: any) => {
    setContactEmail(val);
  };

  // #endregion

  const FormImages = async (logo, oldName: string, newName: string) => {
    let arr = null;
    try {
      const formData = new FormData();
      formData.append("file", RenameFile(logo, oldName, newName));
      await axios
        .post("/api/media", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data) {
            arr = response.data.doc;
          }
        });
      return arr;
    } catch (error) {
      notify.error("Image created failed");
      throw new Error(error);
    }
  };
  // #region Save settings functions

  const SaveSetting = async () => {
    setLoading(true);
    let logoImg;
    if (settingData?.logo?.id) {
      logoImg = settingData?.logo;
    } else {
      logoImg = await FormImages(logo, logo.name, "NVBPlay-Logo");
    }

    let arr: SocialLink[] = [];
    let arr2: Sliders[] = [];
    if (socialLinks.length > 0) {
      for (const link of socialLinks) {
        if (link?.logo?.id) {
          arr.push({
            logo: link.logo.id,
            name: link.name,
            url: link.url,
          });
        } else {
          const socialLinkData = await FormImages(
            link.logo,
            link.logo.path,
            `${link.logo.path}-social-links`
          );
          if (socialLinkData) {
            arr.push({
              logo: socialLinkData.id,
              name: link.name,
              url: link.url,
            });
          }
        }
        // console.log("link: " + JSON.stringify(link));
        // console.log("Aray link: " + JSON.stringify(socialLinkData));
      }
    }
    if (sliders.length > 0) {
      for (const slider of sliders) {
        if (slider?.image?.id) {
          arr2.push({
            image: slider.image.id,
            title: slider.title,
            subtitle: slider.subtitle,
            color: slider.color,
            url: slider.url,
          });
        } else {
          const slidersData = await FormImages(
            slider.image,
            slider.image.path,
            `${slider.image.path}-sliders-links`
          );
          if (slidersData) {
            arr2.push({
              image: slidersData.id,
              title: slider.title,
              subtitle: slider.subtitle,
              color: slider.color,
              url: slider.url,
            });
          }
        }
        setTimeout(() => {
          console.log(JSON.stringify(slider));
        }, 3000);
        // console.log("link: " + JSON.stringify(link));
        // console.log("Aray link: " + JSON.stringify(socialLinkData));
      }
    }

    console.log(JSON.stringify(arr));
    if (logoImg && arr.length > 0) {
      let settingsForm: SettingForm = {
        site_name: siteName,
        logo: logoImg.id,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        contact_email: contactEmail,
        social_links: arr,
        sliders: arr2,
      };

      try {
        await axios
          .post("/api/globals/settings", settingsForm, {
            headers: {"Content-Type": "application/json"},
          })
          .then((response) => {
            if (response.data) {
              notify.success("Save settings successfully");
            } else {
              notify.error("Save settings failed");
            }
          });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        notify.error("Save settings failed");
      }
    } else {
      setLoading(false);
      notify.error("Save settings failed");
    }

    setLoading(false);
  };

  // #endregion

  // #region Social link handler
  const CreateNewSocialLink = () => {
    setSocialLinks((prev) => [...prev, {logo: null, name: "", url: ""}]);
  };

  const handleChangeLogoSocialLink = (value: PreviewFile, index: number) => {
    setSocialLinks((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {...item, logo: value.id};
        }
        return item;
      })
    );
  };
  const handleChangeNameSocialLink = (value: string, index: number) => {
    setSocialLinks((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {...item, name: value};
        }
        return item;
      })
    );
  };
  const handleChangeUrlSocialLink = (value: string, index: number) => {
    setSocialLinks((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {...item, url: value};
        }
        return item;
      })
    );
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks((prev) =>
      prev
        .map((item, i) => (i === index ? {...item, logo: null} : item))
        .filter((_, i) => i !== index)
    );
    setTimeout(() => {
      console.log(socialLinks);
    }, 5000);
  };

  // #endregion
  // #region Sliders handler
  const CreateNewSlider = () => {
    setSliders((prev) => [
      ...prev,
      {
        image: "",
        title: "",
        subtitle: "",
        color: "",
        url: "",
      },
    ]);
  };
  const handleChangeLogoSlider = (data: {value?: File; index: any}) => {
    let arr = sliders;
    arr[data.index].image = data.value;
    setSliders(arr);
    console.log(JSON.stringify(arr));
  };
  const handleChangeNameSlider = (data: {value: any; index: any}) => {
    let arr = sliders;
    arr[data.index].title = data.value;
    setSliders(arr);
  };
  const handleChangeSubNameSlider = (data: {value: any; index: any}) => {
    let arr = sliders;
    arr[data.index].subtitle = data.value;
    setSliders(arr);
  };
  const handleChangeColorSlider = (data: {value: any; index: any}) => {
    let arr = sliders;
    arr[data.index].color = data.value;
    setSliders(arr);
    console.log(JSON.stringify(arr));
  };
  const handleChangeUrlSlider = (data: {value: any; index: any}) => {
    let arr = sliders;
    arr[data.index].url = data.value;
    setSliders(arr);
  };
  const handleImageIdSlider = (data: {value: any; index: any}) => {
    let arr = sliders;
    arr[data.index].image = data.value;
    setSliders(arr);
    console.log(JSON.stringify(arr));
  };

  const handleRemoveSlider = (index: number) => {
    setSliders((prevSliders) => {
      const updatedSliders = [...prevSliders];
      updatedSliders.splice(index, 1);
      return updatedSliders;
    });
  };

  // #endregion

  return (
    <ManagementContainer
      title="Settings"
      maxWidth={true}
      besideElement={
        <Button
          onClick={() => SaveSetting()}
          className={`w-fit ${loading && "pointer-events-none select-none"}`}
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Updating ...</span>
            </div>
          ) : (
            "Save"
          )}
        </Button>
      }
    >
      <ToastContainer position="top-right" />
      {/* Introduction */}
      <GridCol3 className="gap-7 p-5">
        <div className="col-span-1 flex flex-col gap-5 text-base">
          <span className="font-semibold">Title and intro</span>
          <span className="">
            The title and intro help define how the store shows up on search
            engines.
          </span>
        </div>
        <div className="col-span-1 lg:col-span-2 border border-gray-100 shadow-md p-5 gap-5 rounded-lg">
          <div className="w-full gap-2 flex flex-col">
            <TextField
              title="Site Name"
              data={siteName || ""}
              onChange={handleSiteNameChange}
            />
            <span className="text-gray-500 mt-2">
              {countName} of 70 characters used
            </span>
          </div>
          <GridCol2 className="h-fit lg:h-16 border border-gray-300 rounded-lg mt-2 px-3">
            <div className="flex justify-start items-center gap-5 col-span-1">
              <Input
                type="color"
                title="Primary Color"
                className="focus:ring-0 focus:outline-none w-20 h-14 !p-0 border-none"
                value={primaryColor || "#000000"}
                onInput={handlePrimaryColorChange}
              />
              <div className="h-full flex flex-col justify-between">
                <span className="text-gray-900 mt-2">Primary Color</span>
                <span className="text-gray-500">{primaryColor}</span>
              </div>
            </div>
            <div className="flex justify-start items-center gap-5 col-span-1">
              <Input
                type="color"
                title="Secondary Color"
                className="focus:ring-0 focus:outline-none w-20 h-14 !p-0 border-none"
                value={secondaryColor || "#000000"}
                onInput={handleSecondaryColorChange}
              />
              <div className="h-full flex flex-col justify-between">
                <span className="text-gray-900 mt-2">Secondary Color</span>
                <span className="text-gray-500">{secondaryColor}</span>
              </div>
            </div>
          </GridCol2>
          <div className="w-full gap-2 flex flex-col">
            <TextField
              title="Contact Email"
              data={contactEmail || ""}
              onChange={handleContactEmailChange}
            />
            <span className="text-gray-500 mt-2"></span>
          </div>
        </div>
      </GridCol3>
      {/* Logo */}
      <GridCol3 className="gap-7 p-5">
        <div className="col-span-1 flex flex-col gap-5 text-base">
          <span className="font-semibold">Logo</span>
          <span className="">The website logo brand.</span>
        </div>
        <div className="col-span-1 lg:col-span-2 border border-gray-100 shadow-md p-5 rounded-lg">
          <UploadField
            onChange={handleLogoChange}
            logo={settingData?.logo?.url || ""}
          />
        </div>
      </GridCol3>
      {/* Social links */}
      <GridCol3 className="gap-7 p-5">
        <div className="col-span-1 flex flex-col gap-5 text-base">
          <span className="font-semibold">Social links</span>
          <span className="">
            The social links provides direct access to a user's social media
            profiles or pages, enabling easy connection and interaction.
          </span>
        </div>
        <div className="col-span-1 lg:col-span-2 border border-gray-100 shadow-md p-5 rounded-lg">
          <div className="mb-5 flex justify-end items-center ">
            <Button variant="secondary" onClick={() => CreateNewSocialLink()}>
              Add new
            </Button>
          </div>
          <div className="flex flex-col gap-7">
            {socialLinks.length > 0 ? (
              socialLinks.map((socialLink, index) => (
                <div
                  className={`overflow-hidden border border-gray-100 transform duration-200 transition-all ${
                    !showSocial.includes(index) ? "h-[28.5rem]" : "h-16"
                  } rounded-lg transform duration-500`}
                >
                  <div
                    className={`flex justify-between items-center h-16 px-3 bg-gray-100 ${
                      showSocial.includes(index) ? "rounded-t-lg" : "rounded-lg"
                    } transition-all duration-200`}
                  >
                    <span className="text-lg font-bold truncate max-w-[12.5rem]">
                      {socialLink.name}
                    </span>
                    <div className="flex items-center w-fit">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSocialLink(index)}
                      >
                        <Trash
                          strokeWidth={1.5}
                          size={16}
                          className="text-red-500"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setShowSocial((prev) =>
                            prev.includes(index)
                              ? prev.filter((item) => item != index)
                              : [...prev, index]
                          )
                        }
                      >
                        <ChevronDown
                          strokeWidth={1.5}
                          className={`${
                            showSocial.includes(index)
                              ? "rotate-0"
                              : "rotate-180"
                          } duration-200 transform`}
                        />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col px-3 py-5 rounded-b-lg gap-4">
                    <UploadField
                      title={"Logo"}
                      onChange={(value) =>
                        handleChangeLogoSocialLink(value, index)
                      }
                      logo={socialLink?.logo?.url && socialLink?.logo?.url}
                    />
                    <div className="flex flex-col gap-2">
                      <Label className="text-base">Name</Label>
                      <Input
                        className={`${Styles.input}`}
                        value={socialLink?.name}
                        onChange={(e) =>
                          handleChangeNameSocialLink(e.target.value, index)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-base">Url</Label>
                      <Input
                        className={`${Styles.input}`}
                        value={socialLink?.url}
                        onChange={(e) =>
                          handleChangeUrlSocialLink(e.target.value, index)
                        }
                      />
                    </div>
                  </div>
                </div>
                // <FormSocialLinks
                //   key={index}
                //   index={index}
                //   logo={socialLink.logo?.url && socialLink.logo.url}
                //   name={socialLink?.name && socialLink.name}
                //   url={socialLink?.url && socialLink.url}
                //   onChangeLogo={handleChangeLogoSocialLink}
                //   onChangeName={handleChangeNameSocialLink}
                //   onChangeUrl={handleChangeUrlSocialLink}
                //   removeButtonElement={
                //     <Button
                //       variant="ghost"
                //       size="icon"
                //       onClick={() => handleRemoveSocialLink(index)}
                //     >
                //       <Trash
                //         strokeWidth={1.5}
                //         size={16}
                //         className="text-red-500"
                //       />
                //     </Button>
                //   }
                // />
              ))
            ) : (
              <NoDataAvailable />
            )}
            <AddNewDashedLineButton
              variant="default"
              size="md"
              onClick={() => CreateNewSocialLink()}
            >
              <div className="flex items-center justify-center">
                <Plus strokeWidth={1.5} size={20} className="text-gray-500" />
                <span className="text-gray-500">Add new</span>
              </div>
            </AddNewDashedLineButton>
          </div>
        </div>
      </GridCol3>
      {/* Sliders */}
      {/* <GridCol3 className="gap-7 p-5">
        <div className="col-span-1 flex flex-col gap-5 text-base">
          <span className="font-semibold">Slider</span>
          <span className="">
            Sliders are interactive elements that let users adjust values or
            choose a range by dragging a handle along a visual track, often used
            for settings like volume, price ranges, or image galleries.
          </span>
        </div>
        <div className="col-span-1 lg:col-span-2 border border-gray-100 shadow-md p-5 rounded-lg">
          <div className="mb-5 flex justify-end items-center ">
            <Button variant="secondary" onClick={() => CreateNewSlider()}>
              Add new
            </Button>
          </div>
          <div className="flex flex-col gap-7">
            {sliders.length > 0 ? (
              sliders.map((slide, sliderIndex) => (
                <FormSlider
                  key={sliderIndex}
                  index={sliderIndex}
                  logo={slide.image?.url && slide.image.url}
                  name={slide?.title && slide.title}
                  subName={slide?.subtitle && slide.subtitle}
                  color={slide?.color && slide.color}
                  url={slide?.url && slide.url}
                  onChangeLogo={handleChangeLogoSlider}
                  onChangeName={handleChangeNameSlider}
                  onChangeSubName={handleChangeSubNameSlider}
                  onChangeColor={handleChangeColorSlider}
                  onChangeUrl={handleChangeUrlSlider}
                  onImageId={handleImageIdSlider}
                  removeButtonElement={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSlider(sliderIndex)}
                    >
                      <Trash
                        strokeWidth={1.5}
                        size={16}
                        className="text-red-500"
                      />
                    </Button>
                  }
                />
              ))
            ) : (
              <NoDataAvailable />
            )}
            <AddNewDashedLineButton
              variant="default"
              size="md"
              onClick={() => CreateNewSlider()}
            >
              <div className="flex items-center justify-center">
                <Plus strokeWidth={1.5} size={20} className="text-gray-500" />
                <span className="text-gray-500">Add new</span>
              </div>
            </AddNewDashedLineButton>
          </div>
        </div>
      </GridCol3> */}
    </ManagementContainer>
  );
};

export default SettingsPage;
